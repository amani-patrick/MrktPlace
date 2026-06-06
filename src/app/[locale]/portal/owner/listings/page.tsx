import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { getListings } from "@/lib/data/listings";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
export const metadata = { title: "My Listings" };

const listingActions = [
  { id: "1", status: "active" },
  { id: "2", status: "active" },
  { id: "3", status: "paused" },
  { id: "4", status: "pending" },
] as const;

export default async function OwnerListingsPage() {
  const listings = await getListings();
  return (
    <div>
      <PortalPageHeader
        title="My listings"
        description="Create, edit, pause, or remove your property listings."
        action={
          <Link href="/listings/new" className={buttonVariants({ size: "sm" })}>
            Add listing
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {listingActions.map((item) => (
          <Badge
            key={item.id}
            variant={item.status === "active" ? "default" : "secondary"}
            className="capitalize"
          >
            Listing #{item.id}: {item.status}
          </Badge>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <AmniiListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
