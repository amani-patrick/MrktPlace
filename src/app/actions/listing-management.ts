"use server";

import { revalidatePath } from "next/cache";
import { syncAgentProfileStats } from "@/lib/data/agent-stats";
import {
  canTransitionListingStatus,
  resolveListingManagerAccess,
  type ListingManageStatusTarget,
} from "@/lib/listing-access";
import { checkRateLimit, logAction } from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import type { ListingStatus } from "@/types";

const MAX_DESCRIPTION_LENGTH = 5000;

interface DbListingRow {
  id: string;
  owner_id: string | null;
  agent_id: string | null;
  status: ListingStatus;
  description: string;
  title: string;
}

async function loadManagedListing(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_suspended")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_suspended) return { error: "suspended" as const };

  const { data: listing, error } = await supabase
    .from("listings")
    .select("id, owner_id, agent_id, status, description, title")
    .eq("id", listingId)
    .maybeSingle();

  if (error || !listing) return { error: "listing_not_found" as const };

  const row = listing as DbListingRow;
  const access = await resolveListingManagerAccess(supabase, user.id, {
    id: row.id,
    ownerId: row.owner_id ?? "",
    agentId: row.agent_id,
  });

  if (!access.canManage) return { error: "not_authorized" as const };

  return { supabase, user, listing: row, access };
}

function revalidateListingPaths(listingId: string, agentId: string | null) {
  revalidatePath("/search");
  revalidatePath("/");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/portal/owner");
  revalidatePath("/portal/owner/listings");
  revalidatePath("/portal/agent");
  revalidatePath("/portal/agent/listings");
  if (agentId) {
    revalidatePath(`/agents/${agentId}`);
    revalidatePath("/agents");
  }
}

export async function updateListingStatus(
  listingId: string,
  status: ListingManageStatusTarget,
) {
  const ctx = await loadManagedListing(listingId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user, listing } = ctx;

  const limit = await checkRateLimit(supabase, user.id, "listing_status_update");
  if (!limit.allowed) return { error: "rate_limited" as const };

  if (!canTransitionListingStatus(listing.status, status)) {
    return { error: "invalid_status_transition" as const };
  }

  const { error } = await supabase
    .from("listings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", listingId);

  if (error) return { error: error.message };

  if (listing.agent_id) {
    await syncAgentProfileStats(supabase, listing.agent_id);
  }

  await logAction(supabase, user.id, "listing_status_update");
  revalidateListingPaths(listingId, listing.agent_id);
  return { success: true, status };
}

export async function updateListingDescription(listingId: string, description: string) {
  const ctx = await loadManagedListing(listingId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user, listing } = ctx;

  const limit = await checkRateLimit(supabase, user.id, "listing_description_update");
  if (!limit.allowed) return { error: "rate_limited" as const };

  const trimmed = description.trim();
  if (!trimmed) return { error: "description_required" as const };
  if (trimmed.length > MAX_DESCRIPTION_LENGTH) return { error: "description_too_long" as const };

  const nextStatus =
    listing.status === "rejected" ? ("pending" as const) : listing.status;

  const { error } = await supabase
    .from("listings")
    .update({
      description: trimmed,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);

  if (error) return { error: error.message };

  await logAction(supabase, user.id, "listing_description_update");
  revalidateListingPaths(listingId, listing.agent_id);
  return { success: true, status: nextStatus };
}

export async function deleteListing(listingId: string, confirmTitle: string) {
  const ctx = await loadManagedListing(listingId);
  if ("error" in ctx) return { error: ctx.error };

  const { supabase, user, listing } = ctx;

  const limit = await checkRateLimit(supabase, user.id, "listing_delete");
  if (!limit.allowed) return { error: "rate_limited" as const };

  if (confirmTitle.trim().toLowerCase() !== listing.title.trim().toLowerCase()) {
    return { error: "delete_confirm_mismatch" as const };
  }

  const agentId = listing.agent_id;

  const { error } = await supabase.from("listings").delete().eq("id", listingId);

  if (error) return { error: error.message };

  if (agentId) {
    await syncAgentProfileStats(supabase, agentId);
  }

  await logAction(supabase, user.id, "listing_delete");
  revalidateListingPaths(listingId, agentId);
  return { success: true };
}
