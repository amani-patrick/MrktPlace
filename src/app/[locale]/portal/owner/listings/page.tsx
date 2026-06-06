import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
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
  const tNotify = await getTranslations("notifications");
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
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((l) => (
            <div key={l.id} className="space-y-2">
              <AmniiListingCard listing={l} />
              <p className="text-xs capitalize text-muted-foreground">
                {l.status}
                {l.status === "pending" ? ` — ${tNotify("listingPending")}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
