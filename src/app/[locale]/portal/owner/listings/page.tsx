import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { ListingManagePanel } from "@/components/listings/listing-manage-panel";
import { ListingStatusBadge } from "@/components/listings/listing-status-badge";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { buttonVariants } from "@/components/ui/button";
import { getListingsForOwner } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("ownerListings") };
}

export default async function OwnerListingsPage() {
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listings = user ? await getListingsForOwner(user.id) : [];

  return (
    <div>
      <PortalPageHeader
        title={t("ownerListings")}
        description={t("ownerListingsDesc")}
        action={
          <Link href="/listings/new" className={buttonVariants({ size: "sm" })}>
            {t("addListing")}
          </Link>
        }
      />

      {listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
          {t("noListingsYet")}
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-3">
              <AmniiListingCard listing={listing} />
              <div className="flex items-center justify-between gap-2 px-1">
                <ListingStatusBadge status={listing.status} listingType={listing.listingType} />
                <Link
                  href={`/listings/${listing.id}`}
                  className="text-xs font-semibold text-amnii-gold-dark hover:underline"
                >
                  {t("viewListing")}
                </Link>
              </div>
              <ListingManagePanel
                listingId={listing.id}
                title={listing.title}
                description={listing.description}
                status={listing.status}
                listingType={listing.listingType}
                managerRole="owner"
                redirectAfterDelete="/portal/owner/listings"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
