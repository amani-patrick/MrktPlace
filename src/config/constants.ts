export const PROPERTY_TYPES = [
  "apartment",
  "house",
  "room",
  "studio",
  "commercial",
  "office",
  "land",
  "warehouse",
  "mixed_use",
] as const;

export const LISTING_TYPES = [
  "rent",
  "sale",
  "lease",
  "short_stay",
  "commercial_rent",
] as const;

export const USER_ROLES = ["seeker", "owner", "agent", "admin"] as const;

export const HERO_SEARCH_TABS = [
  { id: "rent", label: "Rent", href: "/search?type=rent" },
  { id: "sale", label: "Buy", href: "/search?type=sale" },
  { id: "short_stay", label: "Short stay", href: "/search?type=short_stay" },
  { id: "agents", label: "Agents", href: "/agents" },
] as const;

export const QUICK_BROWSE = [
  { label: "Apartments", href: "/search?property=apartment", icon: "building" },
  { label: "Houses", href: "/search?property=house", icon: "home" },
  { label: "Rooms", href: "/search?property=room", icon: "door" },
  { label: "Studios", href: "/search?property=studio", icon: "layout" },
  { label: "Commercial", href: "/search?property=commercial", icon: "store" },
  { label: "Land", href: "/search?property=land", icon: "map" },
] as const;

export const PLATFORM_STATS = [
  { value: "2,400+", label: "Active listings", color: "primary" },
  { value: "30", label: "Districts covered", color: "accent" },
  { value: "100%", label: "Free to use", color: "secondary" },
  { value: "0", label: "Hidden contact fees", color: "primary" },
] as const;

export const RWANDA_COLORS = {
  blue: "#00A1DE",
  yellow: "#FAD201",
  green: "#20603D",
} as const;

export const POPULAR_DISTRICTS = [
  {
    name: "Gasabo",
    slug: "gasabo",
    listingCount: 842,
    tag: "Most popular",
  },
  {
    name: "Kicukiro",
    slug: "kicukiro",
    listingCount: 516,
    tag: "Family friendly",
  },
  {
    name: "Nyarugenge",
    slug: "nyarugenge",
    listingCount: 398,
    tag: "City centre",
  },
  {
    name: "Remera",
    slug: "remera",
    listingCount: 284,
    tag: "Young professionals",
  },
  {
    name: "Kimironko",
    slug: "kimironko",
    listingCount: 221,
    tag: "Budget friendly",
  },
  {
    name: "Musanze",
    slug: "musanze",
    listingCount: 156,
    tag: "Northern Rwanda",
  },
] as const;

export const SAFETY_TIPS = [
  {
    title: "Visit before you pay",
    description:
      "Never send money before physically visiting the property and meeting the owner or agent.",
  },
  {
    title: "Verify the listing",
    description:
      "Look for verified badges and confirm property details match what you see in person.",
  },
  {
    title: "Use official contact",
    description:
      "Contact landlords directly through the phone or WhatsApp numbers shown on the listing.",
  },
  {
    title: "Report suspicious activity",
    description:
      "Report scams, duplicates, or wrong information to help keep the marketplace safe.",
  },
] as const;

export const SAFETY_WARNING =
  "Never send money before physically visiting the property.";
