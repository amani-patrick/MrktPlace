import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ListingGrid } from "@/components/home/listing-grid";
import { mockListings } from "@/lib/mock-listings";

export const metadata = { title: "Saved Listings" };

export default function SeekerFavoritesPage() {
  return (
    <div>
      <PortalPageHeader
        title="Saved listings"
        description="Properties you've bookmarked for later."
      />
      <ListingGrid listings={mockListings} />
    </div>
  );
}
