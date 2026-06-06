/**
 * Listing ranking formula (future search sort).
 *
 * Final score = weighted sum of component scores, then optional premium multiplier.
 * Not wired into live search yet — all listings are treated as free (no premium boost).
 *
 * @see AGENT.md — "Search Ranking Formula"
 * @see src/config/monetization.ts — MONETIZATION_ENABLED
 */

import { MONETIZATION_ENABLED } from "@/config/monetization";

/** Component weights — relevance must always dominate (50%). */
export const RANKING_WEIGHTS = {
  relevance: 0.5,
  freshness: 0.2,
  quality: 0.15,
  verification: 0.1,
  // premium is applied as a multiplier on the final score, not a weight
} as const;

/**
 * Premium boost when monetization is enabled (paid featured / boosted listings).
 * Applied as +20% or +30% to the final weighted score — NOT a flat +1000 override.
 *
 * Disabled today: every listing is free; multiplier stays 1.
 */
export const PREMIUM_BOOST_MULTIPLIER = {
  featured: 1.2, // +20%
  boosted: 1.3, // +30%
} as const;

export interface SearchIntent {
  district?: string;
  sector?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  listingType?: string;
}

export interface RankableListing {
  district: string;
  sector: string;
  price: number;
  propertyType: string;
  bedrooms: number | null;
  listingType: string;
  description: string;
  features: string[];
  latitude: number | null;
  longitude: number | null;
  contactPhone: string;
  verificationStatus: string;
  createdAt: string;
  /** From DB when available */
  qualityScore?: number;
  imageCount?: number;
  agentVerified?: boolean;
  /** Future: featured_listing | boosted_listing | null */
  premiumTier?: "featured" | "boosted" | null;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

/** 0–100. Match search intent — district, sector, price, type, bedrooms. */
export function relevanceScore(listing: RankableListing, intent: SearchIntent): number {
  const checks: boolean[] = [];

  if (intent.district) {
    checks.push(listing.district.toLowerCase().includes(intent.district.toLowerCase()));
  }
  if (intent.sector) {
    checks.push(listing.sector.toLowerCase().includes(intent.sector.toLowerCase()));
  }
  if (intent.propertyType) {
    checks.push(listing.propertyType === intent.propertyType);
  }
  if (intent.listingType) {
    checks.push(listing.listingType === intent.listingType);
  }
  if (intent.bedrooms != null && listing.bedrooms != null) {
    checks.push(listing.bedrooms >= intent.bedrooms);
  }
  if (intent.minPrice != null || intent.maxPrice != null) {
    const min = intent.minPrice ?? 0;
    const max = intent.maxPrice ?? Infinity;
    checks.push(listing.price >= min && listing.price <= max);
  }

  if (checks.length === 0) return 80;
  const matched = checks.filter(Boolean).length;
  return clamp((matched / checks.length) * 100);
}

/** 0–100. New listings deserve visibility; old ones decay. */
export function freshnessScore(createdAt: string, now = new Date()): number {
  const ageDays = Math.floor(
    (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (ageDays <= 3) return 100;
  if (ageDays <= 7) return 80;
  if (ageDays <= 14) return 50;
  return 10;
}

/** 0–100. Reward complete, high-effort listings. */
export function qualityScore(listing: RankableListing): number {
  if (listing.qualityScore != null) {
    return clamp(listing.qualityScore);
  }

  let score = 0;
  const photos = listing.imageCount ?? 0;
  if (photos >= 15) score += 30;
  else if (photos >= 8) score += 20;
  else if (photos >= 3) score += 10;

  if (listing.description.trim().length >= 120) score += 20;
  if (listing.latitude != null && listing.longitude != null) score += 20;
  if (listing.contactPhone.trim().length >= 9) score += 20;
  if (listing.features.length >= 3) score += 10;

  return clamp(score);
}

/** 0–100. Trust signals. */
export function verificationScore(listing: RankableListing): number {
  let score = 0;
  if (listing.verificationStatus === "verified") score += 50;
  if (listing.agentVerified) score += 30;
  if (listing.contactPhone.trim().length >= 9) score += 10;
  return clamp(score);
}

/**
 * Weighted ranking score (0–100 scale before premium).
 * Premium multiplier applied only when MONETIZATION_ENABLED and listing has a paid tier.
 */
export function computeRankingScore(
  listing: RankableListing,
  intent: SearchIntent = {},
): number {
  const relevance = relevanceScore(listing, intent);
  const freshness = freshnessScore(listing.createdAt);
  const quality = qualityScore(listing);
  const verification = verificationScore(listing);

  let total =
    relevance * RANKING_WEIGHTS.relevance +
    freshness * RANKING_WEIGHTS.freshness +
    quality * RANKING_WEIGHTS.quality +
    verification * RANKING_WEIGHTS.verification;

  // Premium boost — disabled until paid plans launch (all listings free today).
  if (MONETIZATION_ENABLED && listing.premiumTier) {
    const multiplier =
      listing.premiumTier === "boosted"
        ? PREMIUM_BOOST_MULTIPLIER.boosted
        : PREMIUM_BOOST_MULTIPLIER.featured;
    total *= multiplier;
  }

  return Math.round(total * 100) / 100;
}

/** Sort listings by ranking score (highest first). Hook up in search when ready. */
export function sortByRankingScore<T extends RankableListing>(
  listings: T[],
  intent: SearchIntent = {},
): T[] {
  return [...listings].sort(
    (a, b) => computeRankingScore(b, intent) - computeRankingScore(a, intent),
  );
}
