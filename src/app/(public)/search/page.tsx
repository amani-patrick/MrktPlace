import { Suspense } from "react";
import Link from "next/link";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { AmniiSearchFilters } from "@/components/amnii/search-filters";
import { getListings } from "@/lib/data/listings";
import { describeSearch, type SearchFilters as Filters } from "@/lib/search-listings";

export const metadata = {
  title: "Find Properties in Rwanda",
  description: "Search apartments, houses, rooms, and land across Rwanda.",
};

interface SearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function normalizeFilters(
  params: Record<string, string | string[] | undefined>,
): Filters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    q: get("q"),
    type: get("type"),
    property: get("property"),
    district: get("district"),
    bedrooms: get("bedrooms"),
    verified: get("verified"),
    featured: get("featured"),
    sort: get("sort"),
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const filters = normalizeFilters(params);
  const description = describeSearch(filters);

  const results = await getListings({
    q: filters.q,
    listingType: filters.type,
    propertyType: filters.property,
    district: filters.district,
    verifiedOnly: filters.verified === "true",
  });

  const bedroomFiltered =
    filters.bedrooms && filters.bedrooms !== ""
      ? results.filter((l) => {
          if (!l.bedrooms) return false;
          if (filters.bedrooms === "4+") return l.bedrooms >= 4;
          return l.bedrooms === Number(filters.bedrooms);
        })
      : results;

  return (
    <div className="bg-amnii-cream min-h-screen">
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-amnii-navy sm:text-4xl">
            Find Properties in Rwanda
          </h1>
          <p className="mt-2 text-muted-foreground">
            Showing results for{" "}
            <span className="font-medium text-foreground">{description}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-amnii-gold-dark">
            {bedroomFiltered.length}{" "}
            {bedroomFiltered.length === 1 ? "listing" : "listings"} found · Contact
            details always visible
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <Suspense
            fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}
          >
            <AmniiSearchFilters />
          </Suspense>

          <div>
            {bedroomFiltered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {bedroomFiltered.map((listing) => (
                  <AmniiListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
                <p className="font-semibold text-amnii-navy">
                  No listings match your search
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try removing filters or searching a different district.
                </p>
                <Link
                  href="/search"
                  className="mt-4 inline-block text-sm font-semibold text-amnii-gold-dark hover:underline"
                >
                  View all listings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
