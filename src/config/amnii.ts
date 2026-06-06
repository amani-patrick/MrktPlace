export const amniiConfig = {
  name: "Amnii",
  tagline: "Real Estate Rwanda",
  description:
    "The most reliable platform for real estate in Rwanda. Connecting buyers, sellers, and tenants with professional integrity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const amniiNav = [
  { label: "Buy", href: "/search?type=sale" },
  { label: "Rent", href: "/search?type=rent" },
  { label: "Agents", href: "/agents" },
  { label: "About", href: "/about" },
] as const;

export const amniiFeatures = [
  {
    title: "Verified Listings",
    description:
      "Every property is reviewed for accuracy. Look for verified badges before you visit or pay.",
    icon: "shield",
  },
  {
    title: "Direct Contact",
    description:
      "Phone and WhatsApp are always visible. No unlock fees, no hidden charges — contact owners directly.",
    icon: "phone",
  },
  {
    title: "Local Expertise",
    description:
      "Search by province, district, and sector across all 30 districts of Rwanda.",
    icon: "map",
  },
] as const;
