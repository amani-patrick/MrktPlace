import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getListings } from "@/lib/data/listings";
import { cn } from "@/lib/utils";

export const metadata = { title: "Agent Portal" };

export default async function AgentPortalPage() {
  const listings = (await getListings({ limit: 3 }));

  return (
    <div>
      <PortalPageHeader
        title="Agent dashboard"
        description="Manage client listings, monitor leads, and grow your verified reputation."
        action={
          <Link
            href="/portal/agent/profile"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
            Edit profile
          </Link>
        }
      />

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amnii-gold/30 bg-amnii-gold/10 px-4 py-2 text-sm font-medium text-amnii-navy">
        <BadgeCheck className="size-4 text-amnii-gold" aria-hidden="true" />
        Verified agent
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Active listings" value={15} accent="navy" />
        <PortalStatCard label="Profile views" value="3,420" accent="gold" />
        <PortalStatCard label="Leads this month" value={28} accent="cream" />
        <PortalStatCard label="Avg. response" value="1.5h" accent="navy" />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">Managed listings</h2>
          <Link
            href="/portal/agent/listings"
            className="text-sm font-semibold text-amnii-gold-dark hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <AmniiListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
