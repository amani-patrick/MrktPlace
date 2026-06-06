import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { getListings } from "@/lib/data/listings";

export const metadata = { title: "Saved Listings" };

export default async function SeekerFavoritesPage() {
  const listings = await getListings({ limit: 6 });

  return (
    <div>
      <PortalPageHeader
        title="Saved listings"
        description="Properties you've bookmarked for later."
      />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {listings.map((l) => (
          <AmniiListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
