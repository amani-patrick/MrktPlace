/**
 * Future monetization model — architecture hooks only.
 * All features disabled in production until liquidity targets are met.
 * See AGENT.md for full investor narrative.
 */

export const MONETIZATION_ENABLED = false;

export const LIQUIDITY_TARGETS = {
  minActiveListings: 500,
  minMonthlyContacts: 2000,
  minVerifiedAgents: 50,
} as const;

/** Paid placement types (not active) */
export const PAID_PRODUCTS = {
  featuredListing: {
    id: "featured_listing",
    priceRwf: 15000,
    durationDays: 7,
    description: "Top of search results in district",
  },
  boostedListing: {
    id: "boosted_listing",
    priceRwf: 8000,
    durationDays: 3,
    description: "Higher ranking in district browse",
  },
  agentSubscription: {
    id: "agent_subscription",
    priceRwf: 25000,
    durationDays: 30,
    description: "Verified badge, analytics, priority in agent directory",
  },
  districtBoost: {
    id: "district_boost",
    priceRwf: 50000,
    durationDays: 30,
    description: "Agent/district appears in default dropdown featured list",
  },
  ownerAnalyticsPro: {
    id: "owner_analytics_pro",
    priceRwf: 10000,
    durationDays: 30,
    description: "Advanced listing performance and lead insights",
  },
} as const;

export const PAYMENT_METHODS_FUTURE = ["mtn_momo", "airtel_money", "card"] as const;
