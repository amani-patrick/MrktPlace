import type { UserRole } from "@/types";

export type PortalRole = Exclude<UserRole, "admin">;

export interface PortalNavItem {
  label: string;
  href: string;
  description?: string;
}

export interface PortalConfig {
  role: PortalRole;
  title: string;
  description: string;
  accentClass: string;
  accentBg: string;
  accentRing: string;
  accentMuted: string;
  nav: PortalNavItem[];
}

export const PORTAL_CONFIGS: Record<PortalRole, PortalConfig> = {
  seeker: {
    role: "seeker",
    title: "Seeker Portal",
    description: "Browse, save, and track properties you're interested in.",
    accentClass: "text-amnii-navy",
    accentBg: "bg-amnii-navy",
    accentRing: "ring-amnii-navy/15",
    accentMuted: "bg-amnii-navy/5",
    nav: [
      { label: "Overview", href: "/portal/seeker" },
      { label: "Saved listings", href: "/portal/seeker/favorites" },
      { label: "Notifications", href: "/portal/seeker/notifications" },
      { label: "Recent searches", href: "/portal/seeker/searches" },
    ],
  },
  owner: {
    role: "owner",
    title: "Owner Portal",
    description: "Manage your listings, track performance, and respond to inquiries.",
    accentClass: "text-amnii-gold-dark",
    accentBg: "bg-amnii-gold",
    accentRing: "ring-amnii-gold/25",
    accentMuted: "bg-amnii-gold/10",
    nav: [
      { label: "Overview", href: "/portal/owner" },
      { label: "My listings", href: "/portal/owner/listings" },
      { label: "Analytics", href: "/portal/owner/analytics" },
      { label: "Inquiries", href: "/portal/owner/inquiries" },
    ],
  },
  agent: {
    role: "agent",
    title: "Agent Portal",
    description: "Manage client listings, build your profile, and track leads.",
    accentClass: "text-amnii-navy",
    accentBg: "bg-amnii-navy",
    accentRing: "ring-amnii-navy/15",
    accentMuted: "bg-amnii-cream",
    nav: [
      { label: "Overview", href: "/portal/agent" },
      { label: "Managed listings", href: "/portal/agent/listings" },
      { label: "Public profile", href: "/portal/agent/profile" },
      { label: "Performance", href: "/portal/agent/performance" },
    ],
  },
};

export const PORTAL_OPTIONS = [
  {
    role: "seeker" as const,
    title: "Property Seeker",
    description: "Save favourites, get alerts, and track your home search.",
    href: "/portal/seeker",
    iconBg: "bg-amnii-navy",
  },
  {
    role: "owner" as const,
    title: "Property Owner",
    description: "Post listings, view analytics, and manage inquiries.",
    href: "/portal/owner",
    iconBg: "bg-amnii-gold text-amnii-navy",
  },
  {
    role: "agent" as const,
    title: "Agent / Commissioner",
    description: "Manage multiple listings and grow your reputation.",
    href: "/portal/agent",
    iconBg: "bg-amnii-navy",
  },
];
