import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { getOwnerListingPerformance } from "@/lib/data/analytics";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("ownerAnalytics") };
}

export default async function OwnerAnalyticsPage() {
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rows = user ? await getOwnerListingPerformance(user.id) : [];
  const totals = rows.reduce(
    (acc, r) => ({
      views: acc.views + r.views,
      favorites: acc.favorites + r.favorites,
      shares: acc.shares + r.shares,
      contacts: acc.contacts + r.contacts,
    }),
    { views: 0, favorites: 0, shares: 0, contacts: 0 },
  );

  return (
    <div>
      <PortalPageHeader title={t("ownerAnalytics")} description={t("ownerAnalyticsDesc")} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label={t("statViews")} value={totals.views} accent="gold" />
        <PortalStatCard label={t("statFavorites")} value={totals.favorites} accent="navy" />
        <PortalStatCard label={t("statShares")} value={totals.shares} accent="cream" />
        <PortalStatCard label={t("statContacts")} value={totals.contacts} accent="gold" />
      </div>

      <div className="rounded-xl border border-border/80 bg-white shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="font-semibold">{t("topListings")}</h2>
        </div>
        {rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">{t("noListingsYet")}</p>
        ) : (
          <div className="divide-y divide-border/60">
            {rows.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{listing.title}</p>
                  <p className="text-xs text-muted-foreground">{listing.district}</p>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{listing.views} {t("statViews").toLowerCase()}</span>
                  <span>{listing.contacts} {t("statContacts").toLowerCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
