import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { getFavoriteListings } from "@/lib/data/favorites";

export async function generateMetadata() {
  const t = await getTranslations("favorites");
  return { title: t("title") };
}

export default async function SeekerFavoritesPage() {
  const t = await getTranslations("favorites");
  const listings = await getFavoriteListings();

  return (
    <div>
      <PortalPageHeader title={t("title")} description={t("desc")} />
      {listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((l) => (
            <AmniiListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
