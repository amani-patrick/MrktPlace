import { getFavoriteListingIds } from "@/app/actions/favorites";
import { getListings } from "@/lib/data/listings";
import type { Listing } from "@/types";

export async function getFavoriteListings(): Promise<Listing[]> {
  const ids = await getFavoriteListingIds();
  if (!ids.length) return [];

  const all = await getListings();
  const byId = new Map(all.map((l) => [l.id, l]));

  return ids.map((id) => byId.get(id)).filter((l): l is Listing => Boolean(l));
}
