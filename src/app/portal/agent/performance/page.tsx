import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";

const monthlyStats = [
  { month: "March 2026", views: 1240, leads: 28, listings: 15 },
  { month: "February 2026", views: 980, leads: 22, listings: 13 },
  { month: "January 2026", views: 1100, leads: 25, listings: 12 },
];

export const metadata = { title: "Performance" };

export default function AgentPerformancePage() {
  return (
    <div>
      <PortalPageHeader
        title="Performance metrics"
        description="Profile reach, lead activity, and listing statistics over time."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Profile reach" value="3,420" accent="yellow" />
        <PortalStatCard label="Lead activity" value={28} accent="green" />
        <PortalStatCard label="Listing views" value="4,860" accent="blue" />
        <PortalStatCard label="Conversion rate" value="6.2%" accent="yellow" />
      </div>

      <div className="rounded-xl border border-border/80 bg-white shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="font-semibold">Monthly breakdown</h2>
        </div>
        <div className="divide-y divide-border/60">
          {monthlyStats.map((row) => (
            <div
              key={row.month}
              className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4"
            >
              <p className="col-span-2 font-medium sm:col-span-1">{row.month}</p>
              <p className="text-sm text-muted-foreground">{row.views} views</p>
              <p className="text-sm text-muted-foreground">{row.leads} leads</p>
              <p className="text-sm text-muted-foreground">{row.listings} listings</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
