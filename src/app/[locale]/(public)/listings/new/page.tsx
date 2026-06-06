import { getTranslations } from "next-intl/server";
import { NewListingForm } from "@/components/amnii/new-listing-form";
import { getAgentOptions } from "@/lib/data/listings";

export async function generateMetadata() {
  const t = await getTranslations("listPropertyForm");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function NewListingPage() {
  const t = await getTranslations("listPropertyForm");
  const agents = await getAgentOptions();

  return (
    <div className="min-h-screen bg-amnii-cream">
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
            {t("badge")}
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-amnii-navy">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>
      <NewListingForm agents={agents} />
    </div>
  );
}
