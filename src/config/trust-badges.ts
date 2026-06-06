import type { AgentBadge } from "@/types/agent";

export const TRUST_BADGES: Record<
  AgentBadge,
  { label: string; shortLabel: string; description: string; icon: "shield" | "star" | "zap" }
> = {
  trusted_commissioner: {
    label: "Trusted Commissioner™",
    shortLabel: "Trusted Commissioner",
    description:
      "Verified commissioner with a proven track record of authentic listings and high response rates on WhatsApp and phone.",
    icon: "shield",
  },
  quality_lister: {
    label: "Quality Lister",
    shortLabel: "Quality Lister",
    description:
      "Consistently posts accurate property details with real photos, correct pricing, and up-to-date availability.",
    icon: "star",
  },
  quick_responder: {
    label: "Quick Responder",
    shortLabel: "Quick Responder",
    description:
      "Replies to inquiries within 2 hours on average — critical for Rwanda's fast-moving rental market.",
    icon: "zap",
  },
};

export const RWANDA_TRUST_PILLARS = [
  {
    title: "Contact is always free",
    description:
      "Phone numbers and WhatsApp are visible on every listing. Contact landlords and agents directly.",
    color: "blue" as const,
  },
  {
    title: "Verified commissioners",
    description:
      "Agents earn Trusted Commissioner badges through verified identity, response time, and listing quality.",
    color: "green" as const,
  },
  {
    title: "Visit before you pay",
    description:
      "We warn on every listing: never send money before physically visiting the property in person.",
    color: "yellow" as const,
  },
  {
    title: "Built for Kigali & beyond",
    description:
      "Search by district, sector, and cell — covering all 30 districts with mobile-first, slow-network design.",
    color: "blue" as const,
  },
] as const;
