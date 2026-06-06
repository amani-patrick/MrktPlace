import { getTranslations } from "next-intl/server";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortalStatCard } from "@/components/portal/portal-stat-card";
import { buttonVariants } from "@/components/ui/button";
import { getListingsForOwner } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("ownerOverviewTitle") };
}

export default async function OwnerPortalPage() {
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const myListings = user ? await getListingsForOwner(user.id) : [];
  const preview = myListings.slice(0, 2);
  const activeCount = myListings.filter((l) => l.status === "active").length;

  return (
    <div>
      <PortalPageHeader
        title={t("ownerOverviewTitle")}
        description={t("ownerOverviewDesc")}
        action={
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
            )}
          >
            {t("postNewListing")}
          </Link>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PortalStatCard label={t("statActiveListings")} value={activeCount} accent="gold" />
        <PortalStatCard label={t("statTotalViews")} value="—" accent="navy" />
        <PortalStatCard label={t("statContacts")} value="—" accent="cream" />
        <PortalStatCard
          label={t("statInquiries")}
          value="—"
          accent="gold"
          hint={t("pendingHint")}
        />
      </div>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("yourListingsSection")}</h2>
          <Link
            href="/portal/owner/listings"
            className="text-sm font-semibold text-amnii-gold-dark hover:underline"
          >
            {t("manageAll")}
          </Link>
        </div>
        {preview.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("noListingsYet")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {preview.map((listing) => (
              <AmniiListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
