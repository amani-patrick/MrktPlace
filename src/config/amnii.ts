export const amniiConfig = {
  name: "Amnii",
  tagline: "Real Estate Rwanda",
  description:
    "The most reliable platform for real estate in Rwanda. Connecting buyers, sellers, and tenants with professional integrity.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const amniiNav = [
  { key: "buy", href: "/search?type=sale" },
  { key: "rent", href: "/search?type=rent" },
  { key: "agents", href: "/agents" },
  { key: "about", href: "/about" },
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
      "Phone and WhatsApp are always visible. Contact owners and agents directly — no hidden fees.",
    icon: "phone",
  },
  {
    title: "Local Expertise",
    description:
      "Search by province, district, and sector across all 30 districts of Rwanda.",
    icon: "map",
  },
] as const;

export const amniiValues = [
  {
    title: "Trust first",
    description: "Verification, reporting, and transparent contact build confidence on both sides.",
  },
  {
    title: "Always direct",
    description: "Seekers reach owners or agents immediately. We never hide phone numbers behind a paywall.",
  },
  {
    title: "Built for Rwanda",
    description: "Districts, sectors, commissioners, and local search patterns — designed for how Kigali actually works.",
  },
] as const;

export const amniiHowItWorks = [
  {
    step: "01",
    title: "Search",
    description: "Browse verified listings across Kigali and all 30 districts. Filter by price, area, and type.",
  },
  {
    step: "02",
    title: "Connect",
    description: "Contact the owner or agent directly by phone or WhatsApp. No middleman fees.",
  },
  {
    step: "03",
    title: "Visit & decide",
    description: "Inspect the property in person. Never pay before you have seen it and met the lister.",
  },
] as const;

export const amniiFaq = [
  {
    question: "Is Amnii free to use?",
    answer:
      "Yes. Browsing listings and contacting owners or agents is completely free. We do not charge unlock fees or hide phone numbers.",
  },
  {
    question: "How do I list my property?",
    answer:
      "Create an account, then use List Property. Choose owner-direct or agent-managed, add photos and details, and publish. Your contact number appears on the listing immediately.",
  },
  {
    question: "What is the difference between Owner Direct and Agent Managed?",
    answer:
      "Owner Direct means you manage the listing and seekers contact you. Agent Managed means a verified Amnii agent handles inquiries on your behalf while you remain the registered owner.",
  },
  {
    question: "What does Verified mean?",
    answer:
      "Verified listings and agents have passed our review process — identity checks, listing accuracy, and track record. Look for the gold verified badge.",
  },
  {
    question: "How do I stay safe from scams?",
    answer:
      "Never send money before visiting a property in person. Verify the lister, use the contact details shown on Amnii only, and report suspicious listings. We review every report.",
  },
  {
    question: "Can I use an agent and still list myself?",
    answer:
      "Yes. Many owners list directly. Others work with a commissioner or agent — Amnii supports both paths on the same platform.",
  },
  {
    question: "How do agents build reputation on Amnii?",
    answer:
      "Agents maintain a public profile, manage listings, earn verified status, and build ratings from response time and listing quality.",
  },
  {
    question: "How do I report a fraudulent listing?",
    answer:
      "Use the report option on any listing page or contact us via the About page. Multiple reports trigger an automatic review queue.",
  },
] as const;
