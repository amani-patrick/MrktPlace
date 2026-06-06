import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { ListingGrid } from "@/components/home/listing-grid";
import { buttonVariants } from "@/components/ui/button";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "Owner Portal" };

export default function OwnerPortalPage() {
  const myListings = mockListings.slice(0, 2);

  return (
    <div>
      <PortalPageHeader
        title="Owner dashboard"
        description="Manage your properties and track how they're performing."
        action={
          <Link href="/listings/new" className={buttonVariants({ size: "sm" })}>
            Post new listing
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Active listings" value={4} accent="green" />
        <PortalStatCard label="Total views" value="1,284" accent="blue" />
        <PortalStatCard label="Contacts generated" value={36} accent="yellow" />
        <PortalStatCard label="Pending inquiries" value={5} accent="green" />
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Your listings</h2>
          <Link
            href="/portal/owner/listings"
            className="text-sm font-medium text-rw-green hover:underline"
          >
            Manage all
          </Link>
        </div>
        <ListingGrid listings={myListings} />
      </section>
    </div>
  );
}
