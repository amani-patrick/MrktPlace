import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { ListingGrid } from "@/components/home/listing-grid";
import { buttonVariants } from "@/components/ui/button";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "Seeker Portal" };

export default function SeekerPortalPage() {
  const saved = mockListings.slice(0, 3);

  return (
    <div>
      <PortalPageHeader
        title="Welcome back"
        description="Track your saved properties and stay updated on new listings."
        action={
          <Link href="/search" className={buttonVariants({ size: "sm" })}>
            Browse listings
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Saved listings" value={12} accent="blue" />
        <PortalStatCard label="Active alerts" value={3} accent="green" />
        <PortalStatCard label="Recent views" value={28} accent="yellow" />
        <PortalStatCard label="Unread notifications" value={2} accent="blue" />
      </div>

      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold">Recently saved</h2>
        <ListingGrid listings={saved} />
      </section>
    </div>
  );
}
