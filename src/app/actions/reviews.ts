"use server";

import { revalidatePath } from "next/cache";
import { syncAgentProfileStats } from "@/lib/data/agent-stats";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, logAction } from "@/lib/rate-limit";

export async function submitAgentReview(input: {
  agentId: string;
  listingId?: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const limit = await checkRateLimit(supabase, user.id, "agent_review");
  if (!limit.allowed) return { error: "rate_limited" as const };

  if (input.rating < 1 || input.rating > 5) {
    return { error: "invalid_rating" as const };
  }

  const { data: agent } = await supabase
    .from("agent_profiles")
    .select("profile_id")
    .eq("id", input.agentId)
    .maybeSingle();

  if (agent?.profile_id === user.id) {
    return { error: "self_review" as const };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_suspended")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_suspended) return { error: "suspended" as const };

  const { error } = await supabase.from("agent_reviews").insert({
    agent_id: input.agentId,
    reviewer_id: user.id,
    listing_id: input.listingId ?? null,
    rating: input.rating,
    comment: input.comment.trim().slice(0, 1000),
  });

  if (error) {
    if (error.code === "23505") return { error: "already_reviewed" as const };
    return { error: error.message };
  }

  await logAction(supabase, user.id, "agent_review");
  await syncAgentProfileStats(supabase, input.agentId);
  revalidatePath("/agents");
  revalidatePath(`/agents/${input.agentId}`);
  return { success: true };
}

export async function reportAgent(input: {
  agentId: string;
  reason: string;
  details?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const limit = await checkRateLimit(supabase, user.id, "agent_report");
  if (!limit.allowed) return { error: "rate_limited" as const };

  const { data: agent } = await supabase
    .from("agent_profiles")
    .select("profile_id")
    .eq("id", input.agentId)
    .maybeSingle();

  if (agent?.profile_id === user.id) {
    return { error: "self_report" as const };
  }

  const { error } = await supabase.from("agent_reports").insert({
    agent_id: input.agentId,
    reporter_id: user.id,
    reason: input.reason.trim().slice(0, 200),
    details: input.details?.trim().slice(0, 1000) ?? null,
    status: "open",
  });

  if (error) return { error: error.message };

  await logAction(supabase, user.id, "agent_report");
  return { success: true };
}
