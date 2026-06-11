import { PLATFORM_CURRENCY } from "@/config/currency";
import { mockListings } from "@/lib/mock-listings";
import { formatPrice } from "@/lib/format";
import type { Listing, ListingType, PropertyType } from "@/types";

export interface SearchFilters {
  q?: string;
  type?: string;
  property?: string;
  district?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
  verified?: string;
  featured?: string;
  sort?: string;
}

export function parsePriceParam(value?: string): number | undefined {
  if (!value?.trim()) return undefined;
  const n = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function matchesBedrooms(listing: Listing, bedrooms: string) {
  if (!listing.bedrooms) return false;
  if (bedrooms === "4+") return listing.bedrooms >= 4;
  return listing.bedrooms === Number(bedrooms);
}

function matchesPriceRange(listing: Listing, min?: number, max?: number) {
  if (min != null && listing.price < min) return false;
  if (max != null && listing.price > max) return false;
  return true;
}

/** Client-side filters applied after DB fetch (bedrooms, price, mock data). */
export function applySearchFilters(listings: Listing[], filters: SearchFilters): Listing[] {
  const min = parsePriceParam(filters.minPrice);
  const max = parsePriceParam(filters.maxPrice);

  return listings.filter((listing) => {
    if (filters.bedrooms && !matchesBedrooms(listing, filters.bedrooms)) return false;
    if (!matchesPriceRange(listing, min, max)) return false;
    return true;
  });
}

function matchesQuery(listing: Listing, query: string) {
  const haystack = [
    listing.title,
    listing.description,
    listing.district,
    listing.sector,
    listing.cell,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function matchesDistrict(listing: Listing, district: string) {
  return listing.district.toLowerCase().includes(district.toLowerCase());
}

export function searchListings(filters: SearchFilters): Listing[] {
  let results = [...mockListings];

  if (filters.q) {
    results = results.filter((listing) => matchesQuery(listing, filters.q!));
  }

  if (filters.type) {
    const type = filters.type as ListingType;
    results = results.filter((listing) => listing.listingType === type);
  }

  if (filters.property) {
    const property = filters.property as PropertyType;
    if (property === "commercial") {
      results = results.filter(
        (listing) =>
          listing.propertyType === "commercial" ||
          listing.propertyType === "office" ||
          listing.listingType === "commercial_rent",
      );
    } else {
      results = results.filter((listing) => listing.propertyType === property);
    }
  }

  if (filters.district) {
    results = results.filter((listing) => matchesDistrict(listing, filters.district!));
  }

  if (filters.bedrooms) {
    const beds = Number(filters.bedrooms);
    if (!Number.isNaN(beds)) {
      results = results.filter((listing) => {
        if (listing.bedrooms === null) return false;
        return beds >= 4 ? listing.bedrooms >= 4 : listing.bedrooms === beds;
      });
    }
  }

  if (filters.verified === "true") {
    results = results.filter((listing) => listing.verificationStatus === "verified");
  }

  const min = parsePriceParam(filters.minPrice);
  const max = parsePriceParam(filters.maxPrice);
  if (min != null || max != null) {
    results = results.filter((listing) => matchesPriceRange(listing, min, max));
  }

  if (filters.sort === "newest") {
    results.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  return results;
}

export function describeSearch(filters: SearchFilters) {
  const parts: string[] = [];

  if (filters.type) parts.push(filters.type.replace(/_/g, " "));
  if (filters.property) parts.push(filters.property.replace(/_/g, " "));
  if (filters.district) parts.push(filters.district);
  if (filters.q) parts.push(`"${filters.q}"`);
  if (filters.verified === "true") parts.push("verified");

  const min = parsePriceParam(filters.minPrice);
  const max = parsePriceParam(filters.maxPrice);
  if (min != null || max != null) {
    if (min != null && max != null) {
      parts.push(
        `${formatPrice(min, PLATFORM_CURRENCY)} – ${formatPrice(max, PLATFORM_CURRENCY)}`,
      );
    } else if (min != null) {
      parts.push(`${formatPrice(min, PLATFORM_CURRENCY)}+`);
    } else if (max != null) {
      parts.push(`≤ ${formatPrice(max, PLATFORM_CURRENCY)}`);
    }
  }

  return parts.length > 0 ? parts.join(" · ") : "all properties";
}
