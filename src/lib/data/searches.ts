import { createClient } from "@/lib/supabase/server";
import { describeSearch, type SearchFilters } from "@/lib/search-listings";

export interface RecentSearch {
  id: string;
  label: string;
  href: string;
  createdAt: string;
}

function metadataToFilters(metadata: Record<string, unknown>): SearchFilters {
  const str = (key: string) => {
    const value = metadata[key];
    return typeof value === "string" && value.length > 0 ? value : undefined;
  };

  return {
    district: str("district"),
    type: str("type"),
    property: str("property"),
    q: str("q"),
  };
}

function filtersToHref(filters: SearchFilters): string {
  const params = new URLSearchParams();
  if (filters.district) params.set("district", filters.district);
  if (filters.type) params.set("type", filters.type);
  if (filters.property) params.set("property", filters.property);
  if (filters.q) params.set("q", filters.q);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

function filtersKey(filters: SearchFilters): string {
  return [filters.district ?? "", filters.type ?? "", filters.property ?? "", filters.q ?? ""].join(
    "|",
  );
}

const RECENT_SEARCHES_NAV_MIN = 2;

export function shouldShowRecentSearchesNav(searchCount: number): boolean {
  return searchCount >= RECENT_SEARCHES_NAV_MIN;
}

export async function getSearchEventCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("listing_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("event_type", "search_performed");

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRecentSearches(userId: string, limit = 10): Promise<RecentSearch[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listing_events")
      .select("id, metadata, created_at")
      .eq("user_id", userId)
      .eq("event_type", "search_performed")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data?.length) return [];

    const seen = new Set<string>();
    const results: RecentSearch[] = [];

    for (const row of data) {
      const metadata = (row.metadata ?? {}) as Record<string, unknown>;
      const filters = metadataToFilters(metadata);
      const key = filtersKey(filters);
      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        id: row.id,
        label: describeSearch(filters),
        href: filtersToHref(filters),
        createdAt: row.created_at,
      });

      if (results.length >= limit) break;
    }

    return results;
  } catch {
    return [];
  }
}
