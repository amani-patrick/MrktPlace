import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ListingGrid } from "@/components/home/listing-grid";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "My Listings" };

const listingActions = [
  { id: "1", status: "active" },
  { id: "2", status: "active" },
  { id: "3", status: "paused" },
  { id: "4", status: "pending" },
] as const;

export default function OwnerListingsPage() {
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

      <ListingGrid listings={mockListings} />
    </div>
  );
}
