import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("searchesTitle") };
}

export default async function SeekerSearchesPage() {
  const t = await getTranslations("portal");

  return (
    <div>
      <PortalPageHeader title={t("searchesTitle")} description={t("searchesDesc")} />
      <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        {t("searchesEmpty")}
      </p>
    </div>
  );
}
