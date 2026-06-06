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
  nav: PortalNavItem[];
}

export const PORTAL_CONFIGS: Record<PortalRole, PortalConfig> = {
  seeker: {
    role: "seeker",
    title: "Seeker Portal",
    description: "Browse, save, and track properties you're interested in.",
    accentClass: "text-rw-blue",
    accentBg: "bg-rw-blue",
    accentRing: "ring-rw-blue/20",
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
    accentClass: "text-rw-green",
    accentBg: "bg-rw-green",
    accentRing: "ring-rw-green/20",
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
    accentClass: "text-rw-yellow",
    accentBg: "bg-rw-yellow",
    accentRing: "ring-rw-yellow/30",
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
    description: "Save favorites, get alerts, and track your home search.",
    href: "/portal/seeker",
    color: "border-rw-blue/30 hover:border-rw-blue bg-rw-blue/5",
    iconColor: "bg-rw-blue text-white",
  },
  {
    role: "owner" as const,
    title: "Property Owner",
    description: "Post listings, view analytics, and manage inquiries.",
    href: "/portal/owner",
    color: "border-rw-green/30 hover:border-rw-green bg-rw-green/5",
    iconColor: "bg-rw-green text-white",
  },
  {
    role: "agent" as const,
    title: "Agent / Commissioner",
    description: "Manage multiple listings and grow your reputation.",
    href: "/portal/agent",
    color: "border-rw-yellow/40 hover:border-rw-yellow bg-rw-yellow/10",
    iconColor: "bg-rw-yellow text-foreground",
  },
];
