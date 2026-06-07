import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

export interface ListingAnalytics {
  views: number;
  favorites: number;
  shares: number;
  contacts: number;
}

export interface ListingPerformanceRow {
  id: string;
  title: string;
  district: string;
  views: number;
  favorites: number;
  contacts: number;
  shares: number;
}

export interface PlatformHealth {
  signups7d: number;
  activeListings: number;
  pendingListings: number;
  openReports: number;
  reviews7d: number;
  contacts7d: number;
  searches7d: number;
  topDistricts: { district: string; count: number }[];
  topReferrals: { source: string; count: number }[];
}

export interface PriceInsightRow {
  district: string;
  propertyType: string;
  listingType: string;
  count: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface ScamFlagRow {
  id: string;
  flagType: string;
  entityType: string;
  entityId: string;
  score: number;
  reason: string;
  status: string;
  createdAt: string;
}

async function getSupabase() {
  return createClient();
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function getListingAnalytics(listingId: string): Promise<ListingAnalytics> {
  const supabase = await getSupabase();

  const [views, contacts, shares, favorites] = await Promise.all([
    supabase
      .from("listing_events")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId)
      .eq("event_type", "listing_viewed"),
    supabase
      .from("listing_events")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId)
      .in("event_type", ["contact_phone", "contact_whatsapp"]),
    supabase
      .from("listing_events")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId)
      .eq("event_type", "listing_shared"),
    supabase
      .from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", listingId),
  ]);

  return {
    views: views.count ?? 0,
    contacts: contacts.count ?? 0,
    shares: shares.count ?? 0,
    favorites: favorites.count ?? 0,
  };
}

export async function getOwnerListingPerformance(
  ownerId: string,
): Promise<ListingPerformanceRow[]> {
  const supabase = await getSupabase();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, district")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!listings?.length) return [];

  const rows: ListingPerformanceRow[] = [];
  for (const listing of listings) {
    const stats = await getListingAnalytics(listing.id);
    rows.push({
      id: listing.id,
      title: listing.title,
      district: listing.district,
      ...stats,
    });
  }

  return rows.sort((a, b) => b.views - a.views);
}

export async function getAgentListingPerformance(
  agentProfileId: string,
): Promise<ListingPerformanceRow[]> {
  const supabase = await getSupabase();

  const { data: listings } = await supabase
    .from("listings")
    .select("id, title, district")
    .eq("agent_id", agentProfileId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (!listings?.length) return [];

  const rows: ListingPerformanceRow[] = [];
  for (const listing of listings) {
    const stats = await getListingAnalytics(listing.id);
    rows.push({
      id: listing.id,
      title: listing.title,
      district: listing.district,
      ...stats,
    });
  }

  return rows.sort((a, b) => b.contacts - a.contacts);
}

export async function getPlatformHealth(): Promise<PlatformHealth> {
  const supabase = await getSupabase();
  const since = daysAgo(7);

  const [
    signups,
    active,
    pending,
    reports,
    reviews,
    contacts,
    searches,
    districtEvents,
    referrals,
  ] = await Promise.all([
    supabase
      .from("signup_surveys")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("agent_reviews")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since),
    supabase
      .from("listing_events")
      .select("id", { count: "exact", head: true })
      .in("event_type", ["contact_phone", "contact_whatsapp"])
      .gte("created_at", since),
    supabase
      .from("listing_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "search_performed")
      .gte("created_at", since),
    supabase
      .from("listing_events")
      .select("metadata")
      .eq("event_type", "search_performed")
      .gte("created_at", since)
      .limit(200),
    supabase.from("signup_surveys").select("referral_source").limit(500),
  ]);

  const districtCounts = new Map<string, number>();
  for (const row of districtEvents.data ?? []) {
    const meta = row.metadata as { district?: string } | null;
    const d = meta?.district;
    if (d) districtCounts.set(d, (districtCounts.get(d) ?? 0) + 1);
  }

  const referralCounts = new Map<string, number>();
  for (const row of referrals.data ?? []) {
    referralCounts.set(
      row.referral_source,
      (referralCounts.get(row.referral_source) ?? 0) + 1,
    );
  }

  return {
    signups7d: signups.count ?? 0,
    activeListings: active.count ?? 0,
    pendingListings: pending.count ?? 0,
    openReports: reports.count ?? 0,
    reviews7d: reviews.count ?? 0,
    contacts7d: contacts.count ?? 0,
    searches7d: searches.count ?? 0,
    topDistricts: [...districtCounts.entries()]
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    topReferrals: [...referralCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
  };
}

export async function getPriceIntelligence(): Promise<PriceInsightRow[]> {
  const supabase = await getSupabase();

  const { data } = await supabase
    .from("listings")
    .select("district, property_type, listing_type, price")
    .eq("status", "active")
    .limit(2000);

  if (!data?.length) return [];

  type PriceGroup = {
    prices: number[];
    district: string;
    propertyType: string;
    listingType: string;
  };
  const groups = new Map<string, PriceGroup>();

  for (const row of data) {
    const key = `${row.district}|${row.property_type}|${row.listing_type}`;
    const g: PriceGroup = groups.get(key) ?? {
      prices: [] as number[],
      district: row.district,
      propertyType: row.property_type,
      listingType: row.listing_type,
    };
    g.prices.push(Number(row.price));
    groups.set(key, g);
  }

  const rows: PriceInsightRow[] = [];
  for (const g of groups.values()) {
    if (g.prices.length < 2) continue;
    const sorted = [...g.prices].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    rows.push({
      district: g.district,
      propertyType: g.propertyType,
      listingType: g.listingType,
      count: sorted.length,
      medianPrice: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
      minPrice: sorted[0],
      maxPrice: sorted[sorted.length - 1],
    });
  }

  return rows.sort((a, b) => b.count - a.count).slice(0, 30);
}

export async function getScamFlags(): Promise<ScamFlagRow[]> {
  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from("platform_flags")
      .select("id, flag_type, entity_type, entity_id, score, reason, status, created_at")
      .eq("status", "open")
      .order("score", { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      flagType: row.flag_type ?? "unknown",
      entityType: row.entity_type ?? "unknown",
      entityId: row.entity_id ? String(row.entity_id) : "",
      score: row.score ?? 0,
      reason: row.reason ?? "",
      status: row.status ?? "open",
      createdAt: row.created_at,
    }));
  } catch {
    return [];
  }
}

export async function runScamDetection(): Promise<number> {
  const supabase = await getSupabase();
  let flagged = 0;

  const { data: phones } = await supabase
    .from("listings")
    .select("contact_phone, owner_id")
    .not("contact_phone", "is", null);

  const phoneOwners = new Map<string, Set<string>>();
  for (const row of phones ?? []) {
    const phone = row.contact_phone?.trim();
    if (!phone) continue;
    const set = phoneOwners.get(phone) ?? new Set();
    if (row.owner_id) set.add(row.owner_id);
    phoneOwners.set(phone, set);
  }

  for (const [phone, owners] of phoneOwners) {
    if (owners.size >= 3) {
      const { data: existing } = await supabase
        .from("platform_flags")
        .select("id")
        .eq("flag_type", "duplicate_phone")
        .eq("reason", `Phone ${phone} used across ${owners.size} owner accounts`)
        .eq("status", "open")
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase.from("platform_flags").insert({
          flag_type: "duplicate_phone",
          entity_type: "phone",
          entity_id: randomUUID(),
          score: owners.size * 10,
          reason: `Phone ${phone} used across ${owners.size} owner accounts`,
          status: "open",
        });
        if (!error) flagged += 1;
      }
    }
  }

  const { data: reported } = await supabase
    .from("reports")
    .select("listing_id")
    .eq("status", "open");

  const reportCounts = new Map<string, number>();
  for (const r of reported ?? []) {
    reportCounts.set(r.listing_id, (reportCounts.get(r.listing_id) ?? 0) + 1);
  }

  for (const [listingId, count] of reportCounts) {
    if (count >= 2) {
      await supabase.from("listings").update({ scam_risk_score: count * 20 }).eq("id", listingId);
      await supabase.from("platform_flags").insert({
        flag_type: "high_reports",
        entity_type: "listing",
        entity_id: listingId,
        score: count * 25,
        reason: `${count} open reports`,
        status: "open",
      });
      flagged += 1;
    }
  }

  return flagged;
}
