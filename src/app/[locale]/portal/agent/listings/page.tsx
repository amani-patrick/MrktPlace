import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { buttonVariants } from "@/components/ui/button";
import { getListingsForAgent } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("agentListings") };
}

export default async function AgentListingsPage() {
  const t = await getTranslations("portal");
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

  return (
    <div>
      <PortalPageHeader
        title={t("agentListings")}
        description={t("agentListingsDesc")}
        action={
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-navy text-white hover:bg-amnii-navy/90",
            )}
          >
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
            <AmniiListingCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
