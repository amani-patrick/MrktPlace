import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { getAgentListingPerformance } from "@/lib/data/analytics";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("agentPerformance") };
}

export default async function AgentPerformancePage() {
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let agentProfileId: string | null = null;
  if (user) {
    const { data: agent } = await supabase
      .from("agent_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();
    agentProfileId = agent?.id ?? null;
  }

  const rows = agentProfileId ? await getAgentListingPerformance(agentProfileId) : [];
  const totals = rows.reduce(
    (acc, r) => ({
      views: acc.views + r.views,
      contacts: acc.contacts + r.contacts,
      favorites: acc.favorites + r.favorites,
    }),
    { views: 0, contacts: 0, favorites: 0 },
  );
  const conversion =
    totals.views > 0 ? `${((totals.contacts / totals.views) * 100).toFixed(1)}%` : "—";

  return (
    <div>
      <PortalPageHeader title={t("agentPerformance")} description={t("agentPerformanceDesc")} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label={t("statViews")} value={totals.views} accent="gold" />
        <PortalStatCard label={t("statContacts")} value={totals.contacts} accent="navy" />
        <PortalStatCard label={t("statFavorites")} value={totals.favorites} accent="cream" />
        <PortalStatCard label={t("statConversion")} value={conversion} accent="gold" />
      </div>

      <div className="rounded-xl border border-border/80 bg-white shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
          <h2 className="font-semibold">{t("managedListings")}</h2>
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
                <p className="font-medium">{listing.title}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{listing.views} views</span>
                  <span>{listing.contacts} leads</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
