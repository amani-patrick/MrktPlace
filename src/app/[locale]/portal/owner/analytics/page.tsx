import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";

const topListings = [
  { title: "Modern 2BR Apartment in Remera", views: 412, contacts: 18 },
  { title: "Family House in Kicukiro", views: 286, contacts: 9 },
  { title: "Furnished Studio in Kacyiru", views: 198, contacts: 6 },
];

export const metadata = { title: "Analytics" };

export default function OwnerAnalyticsPage() {
  return (
    <div>
      <PortalPageHeader
        title="Listing analytics"
        description="Views, favorites, shares, and contacts generated per listing."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Views this month" value="1,284" accent="gold" />
        <PortalStatCard label="Favorites" value={47} accent="navy" />
        <PortalStatCard label="Shares" value={12} accent="cream" />
        <PortalStatCard label="Contacts" value={36} accent="gold" />
      </div>

      <div className="rounded-xl border border-border/80 bg-white shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="font-semibold">Top performing listings</h2>
        </div>
        <div className="divide-y divide-border/60">
          {topListings.map((listing) => (
            <div
              key={listing.title}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-medium">{listing.title}</p>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{listing.views} views</span>
                <span>{listing.contacts} contacts</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
