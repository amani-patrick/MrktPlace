import type { PortalRole } from "@/config/portal";

export const PORTAL_NAV: Record<
  PortalRole,
  { labelKey: string; href: string }[]
> = {
  seeker: [
    { labelKey: "navOverview", href: "/portal/seeker" },
    { labelKey: "navSaved", href: "/portal/seeker/favorites" },
    { labelKey: "navPreferences", href: "/portal/seeker/preferences" },
    { labelKey: "navNotifications", href: "/portal/seeker/notifications" },
    { labelKey: "navRecentSearches", href: "/portal/seeker/searches" },
  ],
  owner: [
    { labelKey: "navOverview", href: "/portal/owner" },
    { labelKey: "navMyListings", href: "/portal/owner/listings" },
    { labelKey: "navAnalytics", href: "/portal/owner/analytics" },
    { labelKey: "navInquiries", href: "/portal/owner/inquiries" },
  ],
  agent: [
    { labelKey: "navOverview", href: "/portal/agent" },
    { labelKey: "navManagedListings", href: "/portal/agent/listings" },
    { labelKey: "navPublicProfile", href: "/portal/agent/profile" },
    { labelKey: "navPerformance", href: "/portal/agent/performance" },
  ],
};
