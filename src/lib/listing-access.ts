import type { SupabaseClient } from "@supabase/supabase-js";
import type { Listing, ListingStatus } from "@/types";

export type ListingManagerRole = "owner" | "agent";

export interface ListingManagerAccess {
  canManage: boolean;
  role: ListingManagerRole | null;
}

const PUBLIC_STATUSES: ListingStatus[] = ["active"];

export function isListingPubliclyVisible(
  listing: Pick<Listing, "status" | "ownerId">,
  userId?: string | null,
): boolean {
  if (PUBLIC_STATUSES.includes(listing.status)) return true;
  if (listing.status === "pending" && userId && userId === listing.ownerId) return true;
  return false;
}

export async function resolveListingManagerAccess(
  supabase: SupabaseClient,
  userId: string | undefined,
  listing: Pick<Listing, "id" | "ownerId" | "agentId">,
): Promise<ListingManagerAccess> {
  if (!userId) return { canManage: false, role: null };

  if (listing.ownerId === userId) {
    return { canManage: true, role: "owner" };
  }

  if (!listing.agentId) return { canManage: false, role: null };

  const { data: agent } = await supabase
    .from("agent_profiles")
    .select("id")
    .eq("id", listing.agentId)
    .eq("profile_id", userId)
    .maybeSingle();

  if (agent) return { canManage: true, role: "agent" };
  return { canManage: false, role: null };
}

export function canViewListingDetail(
  listing: Pick<Listing, "status" | "ownerId">,
  access: ListingManagerAccess,
  userId?: string | null,
): boolean {
  if (isListingPubliclyVisible(listing, userId)) return true;
  return access.canManage;
}

/** Statuses owners/agents may set through self-service management. */
export const MANAGEABLE_LISTING_STATUSES: ListingStatus[] = [
  "active",
  "pending",
  "rented",
  "unlisted",
  "paused",
  "rejected",
];

export type ListingManageStatusTarget = "active" | "rented" | "unlisted" | "pending";

export function canTransitionListingStatus(
  from: ListingStatus,
  to: ListingManageStatusTarget,
): boolean {
  if (to === "rented" || to === "unlisted") return from === "active";
  if (to === "active") return from === "unlisted" || from === "rented" || from === "paused";
  if (to === "pending") return from === "rejected";
  return false;
}
