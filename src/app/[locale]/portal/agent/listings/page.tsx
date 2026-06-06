import Link from "next/link";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { buttonVariants } from "@/components/ui/button";
import { getListings } from "@/lib/data/listings";
import { cn } from "@/lib/utils";

export const metadata = { title: "Managed Listings" };

export default async function AgentListingsPage() {
  const listings = await getListings();

  return (
    <div>
      <PortalPageHeader
        title="Managed listings"
        description="Properties you manage on behalf of owners and clients."
        action={
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
            Add listing
          </Link>
        }
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <AmniiListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
