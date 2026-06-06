import { getTranslations } from "next-intl/server";
import { BadgeCheck } from "lucide-react";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getListingsForAgent } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("agentOverviewTitle") };
}

export default async function AgentPortalPage() {
  const t = await getTranslations("portal");
  const tAgents = await getTranslations("agents");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let listings: Awaited<ReturnType<typeof getListingsForAgent>> = [];
  if (user) {
    const { data: agent } = await supabase
      .from("agent_profiles")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();
    if (agent) {
      listings = await getListingsForAgent(agent.id);
    }
  }

  const preview = listings.slice(0, 3);
  const activeCount = listings.filter((l) => l.status === "active").length;

  return (
    <div>
      <PortalPageHeader
        title={t("agentOverviewTitle")}
        description={t("agentOverviewDesc")}
        action={
          <Link
            href="/portal/agent/profile"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
            {t("editProfile")}
          </Link>
        }
      />

      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amnii-gold/30 bg-amnii-gold/10 px-4 py-2 text-sm font-medium text-amnii-navy">
        <BadgeCheck className="size-4 text-amnii-gold" aria-hidden="true" />
        {tAgents("verifiedAgent")}
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label={t("statActiveListings")} value={activeCount} accent="navy" />
        <PortalStatCard label={t("statProfileViews")} value="—" accent="gold" />
        <PortalStatCard label={t("statLeadsMonth")} value="—" accent="cream" />
        <PortalStatCard label={t("statAvgResponse")} value="—" accent="navy" />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("managedListings")}</h2>
          <Link
            href="/portal/agent/listings"
            className="text-sm font-semibold text-amnii-gold-dark hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>
        {preview.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noListingsYet")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {preview.map((listing) => (
              <AmniiListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
