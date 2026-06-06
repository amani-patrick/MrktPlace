import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { ListingGrid } from "@/components/home/listing-grid";
import { buttonVariants } from "@/components/ui/button";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "Agent Portal" };

export default function AgentPortalPage() {
  return (
    <div>
      <PortalPageHeader
        title="Agent dashboard"
        description="Manage client listings and grow your reputation on the platform."
        action={
          <Link href="/portal/agent/profile" className={buttonVariants({ size: "sm" })}>
            Edit profile
          </Link>
        }
      />

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rw-yellow/40 bg-rw-yellow/15 px-4 py-2 text-sm font-medium">
        <BadgeCheck className="size-4 text-rw-green" aria-hidden="true" />
        Verified agent · Joined Jan 2025
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Active listings" value={15} accent="yellow" />
        <PortalStatCard label="Profile views" value="3,420" accent="blue" />
        <PortalStatCard label="Leads this month" value={28} accent="green" />
        <PortalStatCard label="Avg. response" value="1.5h" accent="yellow" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Managed listings</h2>
          <Link
            href="/portal/agent/listings"
            className="text-sm font-medium text-foreground hover:underline"
          >
            View all
          </Link>
        </div>
        <ListingGrid listings={mockListings.slice(0, 3)} />
      </section>
    </div>
  );
}
