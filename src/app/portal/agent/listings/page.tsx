import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ListingGrid } from "@/components/home/listing-grid";
import { buttonVariants } from "@/components/ui/button";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "Managed Listings" };

export default function AgentListingsPage() {
  return (
    <div>
      <PortalPageHeader
        title="Managed listings"
        description="Properties you manage on behalf of owners and clients."
        action={
          <Link href="/listings/new" className={buttonVariants({ size: "sm" })}>
            Add listing
          </Link>
        }
      />
      <ListingGrid listings={mockListings} />
    </div>
  );
}
