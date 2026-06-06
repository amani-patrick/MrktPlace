import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getUserPreferences } from "@/app/actions/preferences";
import { getFavoriteListings } from "@/lib/data/favorites";
import { getRecentlyViewedListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("seeker") };
}

export default async function SeekerPortalPage() {
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const favorites = await getFavoriteListings();
  const recent = user ? await getRecentlyViewedListings(user.id, 3) : [];
  const prefs = await getUserPreferences();
  const alertsOn = Boolean(prefs?.alerts_enabled);

  return (
    <div>
      <PortalPageHeader
        title={t("seekerWelcome")}
        description={t("seekerDesc")}
        action={
          <Link
            href="/search"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
            {t("browseListings")}
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label={t("savedCount")} value={favorites.length} accent="navy" />
        <PortalStatCard
          label={t("alertsCount")}
          value={alertsOn ? 1 : 0}
          accent="gold"
          hint={alertsOn ? t("alertsOn") : t("alertsOff")}
        />
        <PortalStatCard label={t("recentViews")} value={recent.length} accent="cream" />
        <PortalStatCard label={t("preferences")} value="✓" accent="navy" hint={t("editPreferences")} />
      </div>

      {recent.length > 0 ? (
        <section className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("recentlyViewed")}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {recent.map((listing) => (
              <AmniiListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("recentlySaved")}</h2>
          <Link href="/portal/seeker/favorites" className="text-sm font-semibold text-amnii-gold-dark">
            {t("viewAllSaved")}
          </Link>
        </div>
        {favorites.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("noSavedYet")}</p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.slice(0, 3).map((listing) => (
              <AmniiListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
