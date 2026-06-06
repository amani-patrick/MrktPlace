"use server";

import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/audit";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, error: "Not signed in" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { supabase, error: "Not authorized" as const };
  }

  return { supabase, error: null };
}

function revalidateAdmin() {
  revalidatePath("/portal/admin");
  revalidatePath("/portal/admin/listings");
  revalidatePath("/portal/admin/reports");
  revalidatePath("/portal/admin/agent-reports");
  revalidatePath("/portal/admin/feedback");
  revalidatePath("/portal/admin/health");
  revalidatePath("/portal/admin/pricing");
  revalidatePath("/portal/admin/flags");
  revalidatePath("/portal/admin/users");
  revalidatePath("/search");
}

export async function approveListing(listingId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { data: score } = await supabase.rpc("compute_listing_quality_score", {
    p_listing_id: listingId,
  });

  const { error: updateError } = await supabase
    .from("listings")
    .update({
      status: "active",
      verification_status: "verified",
      quality_score: score ?? 0,
    })
    .eq("id", listingId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("approve_listing", { type: "listing", id: listingId });
  revalidateAdmin();
  return { success: true };
}

export async function rejectListing(listingId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: updateError } = await supabase
    .from("listings")
    .update({ status: "rejected" })
    .eq("id", listingId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("reject_listing", { type: "listing", id: listingId });
  revalidateAdmin();
  return { success: true };
}

export async function dismissReport(reportId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: updateError } = await supabase
    .from("reports")
    .update({ status: "dismissed" })
    .eq("id", reportId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("dismiss_report", { type: "report", id: reportId });
  revalidateAdmin();
  return { success: true };
}

export async function suspendListingFromReport(listingId: string, reportId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: listingError } = await supabase
    .from("listings")
    .update({ status: "paused" })
    .eq("id", listingId);

  if (listingError) return { error: listingError.message };

  const { error: reportError } = await supabase
    .from("reports")
    .update({ status: "reviewing" })
    .eq("id", reportId);

  if (reportError) return { error: reportError.message };

  await logAdminAction("suspend_listing_from_report", {
    type: "listing",
    id: listingId,
  }, { reportId });
  revalidateAdmin();
  return { success: true };
}

export async function suspendUser(userId: string, reason?: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_suspended: true,
      suspended_at: new Date().toISOString(),
      suspension_reason: reason ?? "Suspended by admin",
    })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("suspend_user", { type: "user", id: userId }, { reason });
  revalidateAdmin();
  return { success: true };
}

export async function dismissAgentReport(reportId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: updateError } = await supabase
    .from("agent_reports")
    .update({ status: "dismissed" })
    .eq("id", reportId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("dismiss_agent_report", { type: "agent_report", id: reportId });
  revalidateAdmin();
  return { success: true };
}

export async function suspendAgentFromReport(agentId: string, reportId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { data: agent } = await supabase
    .from("agent_profiles")
    .select("profile_id")
    .eq("id", agentId)
    .maybeSingle();

  if (!agent?.profile_id) return { error: "Agent not found" };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      is_suspended: true,
      suspended_at: new Date().toISOString(),
      suspension_reason: "Suspended following agent report",
    })
    .eq("id", agent.profile_id);

  if (profileError) return { error: profileError.message };

  const { error: reportError } = await supabase
    .from("agent_reports")
    .update({ status: "reviewing" })
    .eq("id", reportId);

  if (reportError) return { error: reportError.message };

  await logAdminAction("suspend_agent_from_report", { type: "agent", id: agentId }, { reportId });
  revalidateAdmin();
  return { success: true };
}

export async function unsuspendUser(userId: string) {
  const { supabase, error } = await requireAdmin();
  if (error) return { error };

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_suspended: false,
      suspended_at: null,
      suspension_reason: null,
    })
    .eq("id", userId);

  if (updateError) return { error: updateError.message };

  await logAdminAction("unsuspend_user", { type: "user", id: userId });
  revalidateAdmin();
  return { success: true };
}
