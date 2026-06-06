import Link from "next/link";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getListings } from "@/lib/data/listings";
import { cn } from "@/lib/utils";

export const metadata = { title: "Seeker Portal" };

export default async function SeekerPortalPage() {
  const saved = (await getListings({ limit: 3 }));

  return (
    <div>
      <PortalPageHeader
        title="Welcome back"
        description="Track saved properties and stay ahead of new listings in your areas."
        action={
          <Link
            href="/search"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
            Browse listings
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label="Saved listings" value={12} accent="navy" />
        <PortalStatCard label="Active alerts" value={3} accent="gold" />
        <PortalStatCard label="Recent views" value={28} accent="cream" />
        <PortalStatCard label="Notifications" value={2} accent="navy" hint="Unread" />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-amnii-navy">Recently saved</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((listing) => (
            <AmniiListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
