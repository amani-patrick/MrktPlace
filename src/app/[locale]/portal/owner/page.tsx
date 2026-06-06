import Link from "next/link";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getListings } from "@/lib/data/listings";
import { cn } from "@/lib/utils";

export const metadata = { title: "Owner Portal" };

export default async function OwnerPortalPage() {
  const myListings = (await getListings({ limit: 2 }));

  return (
    <div>
      <PortalPageHeader
        title="Owner dashboard"
        description="Manage your properties and see how they perform with seekers."
        action={
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
            )}
          >
            Post new listing
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Active listings" value={4} accent="gold" />
        <PortalStatCard label="Total views" value="1,284" accent="navy" />
        <PortalStatCard label="Contacts" value={36} accent="cream" />
        <PortalStatCard label="Inquiries" value={5} accent="gold" hint="Pending" />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">Your listings</h2>
          <Link
            href="/portal/owner/listings"
            className="text-sm font-semibold text-amnii-gold-dark hover:underline"
          >
            Manage all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {myListings.map((listing) => (
            <AmniiListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
