import { mockListings } from "@/lib/mock-listings";
import type { Listing, ListingType, PropertyType } from "@/types";

export interface SearchFilters {
  q?: string;
  type?: string;
  property?: string;
  district?: string;
  bedrooms?: string;
  verified?: string;
  featured?: string;
  sort?: string;
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

  return parts.length > 0 ? parts.join(" · ") : "all properties";
}
