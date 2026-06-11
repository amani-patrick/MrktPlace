import type { SupabaseClient } from "@supabase/supabase-js";

export interface AgentComputedStats {
  rentCount: number;
  saleCount: number;
  rating: number | null;
  reviewCount: number;
  /** Avg hours from listing publish to first contact inquiry. */
  responseTimeHours: number | null;
}

const RENT_LISTING_TYPES = new Set(["rent", "lease", "short_stay", "commercial_rent"]);

function emptyStats(): AgentComputedStats {
  return {
    rentCount: 0,
    saleCount: 0,
    rating: null,
    reviewCount: 0,
    responseTimeHours: null,
  };
}

export async function computeAgentStatsBatch(
  supabase: SupabaseClient,
  agentIds: string[],
): Promise<Map<string, AgentComputedStats>> {
  const stats = new Map<string, AgentComputedStats>();
  for (const id of agentIds) stats.set(id, emptyStats());
  if (agentIds.length === 0) return stats;

  const { data: listings } = await supabase
    .from("listings")
    .select("id, agent_id, listing_type, created_at")
    .in("agent_id", agentIds)
    .eq("status", "active");

  const listingMeta = new Map<string, { agentId: string; createdAt: string }>();

  for (const row of listings ?? []) {
    if (!row.agent_id) continue;
    const entry = stats.get(row.agent_id)!;
    if (RENT_LISTING_TYPES.has(row.listing_type)) entry.rentCount += 1;
    else if (row.listing_type === "sale") entry.saleCount += 1;
    listingMeta.set(row.id, { agentId: row.agent_id, createdAt: row.created_at });
  }

  const { data: reviews } = await supabase
    .from("agent_reviews")
    .select("agent_id, rating")
    .in("agent_id", agentIds);

  const ratingsByAgent = new Map<string, number[]>();
  for (const row of reviews ?? []) {
    const list = ratingsByAgent.get(row.agent_id) ?? [];
    list.push(row.rating);
    ratingsByAgent.set(row.agent_id, list);
  }

  for (const [agentId, ratings] of ratingsByAgent) {
    const entry = stats.get(agentId);
    if (!entry || ratings.length === 0) continue;
    entry.reviewCount = ratings.length;
    entry.rating =
      Math.round((ratings.reduce((sum, n) => sum + n, 0) / ratings.length) * 10) / 10;
  }

  const listingIds = [...listingMeta.keys()];
  if (listingIds.length > 0) {
    const { data: contacts } = await supabase
      .from("listing_events")
      .select("listing_id, created_at")
      .in("listing_id", listingIds)
      .in("event_type", ["contact_phone", "contact_whatsapp"])
      .order("created_at", { ascending: true });

    const firstContactByListing = new Map<string, string>();
    for (const event of contacts ?? []) {
      if (!event.listing_id || firstContactByListing.has(event.listing_id)) continue;
      firstContactByListing.set(event.listing_id, event.created_at);
    }

    const hoursByAgent = new Map<string, number[]>();
    for (const [listingId, contactAt] of firstContactByListing) {
      const meta = listingMeta.get(listingId);
      if (!meta) continue;
      const hours =
        (new Date(contactAt).getTime() - new Date(meta.createdAt).getTime()) / 3_600_000;
      if (hours < 0 || hours > 24 * 30) continue;
      const list = hoursByAgent.get(meta.agentId) ?? [];
      list.push(hours);
      hoursByAgent.set(meta.agentId, list);
    }

    for (const [agentId, hoursList] of hoursByAgent) {
      if (hoursList.length === 0) continue;
      const avg = hoursList.reduce((sum, n) => sum + n, 0) / hoursList.length;
      stats.get(agentId)!.responseTimeHours = Math.round(avg * 10) / 10;
    }
  }

  return stats;
}

/** Keep cached columns on agent_profiles aligned with live metrics. */
export async function syncAgentProfileStats(
  supabase: SupabaseClient,
  agentId: string,
): Promise<void> {
  const stats = await computeAgentStatsBatch(supabase, [agentId]);
  const computed = stats.get(agentId);
  if (!computed) return;

  await supabase
    .from("agent_profiles")
    .update({
      rent_count: computed.rentCount,
      sale_count: computed.saleCount,
      rating: computed.rating,
      response_time_hours: computed.responseTimeHours,
    })
    .eq("id", agentId);
}

export function formatResponseTime(hours: number | null | undefined): string | null {
  if (hours == null || hours <= 0) return null;
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))}m`;
  if (hours < 24) return `${Math.round(hours * 10) / 10}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}
