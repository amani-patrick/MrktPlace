import { BadgeCheck, Star } from "lucide-react";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";

export const metadata = { title: "Public Profile" };

export default function AgentProfilePage() {
  return (
    <div>
      <PortalPageHeader
        title="Public profile"
        description="How seekers and owners see your agent profile on the marketplace."
      />

      <div className="rounded-2xl border border-border/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-rw-yellow font-heading text-2xl font-bold text-foreground">
            JB
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-2xl font-bold">Jean Baptiste</h2>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-rw-green">
                <BadgeCheck className="size-4" aria-hidden="true" />
                Verified agent
              </span>
            </div>
            <p className="mt-1 text-muted-foreground">Gasabo District · Kigali, Rwanda</p>
            <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
              Licensed property commissioner with 8+ years experience in Kigali
              residential and commercial rentals. Specializing in Gasabo and
              Kicukiro districts.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1 font-medium">
                <Star className="size-4 fill-rw-yellow text-rw-yellow" aria-hidden="true" />
                4.8 rating
              </span>
              <span>+250 788 000 100</span>
              <span>15 active listings</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <PortalStatCard label="Total views" value="12,400" accent="navy" />
        <PortalStatCard label="Completed deals" value={34} accent="gold" />
        <PortalStatCard label="Response time" value="1.5h" accent="cream" />
      </div>
    </div>
  );
}
