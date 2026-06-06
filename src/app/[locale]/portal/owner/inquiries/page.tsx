import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("inquiriesTitle") };
}

export default async function OwnerInquiriesPage() {
  const t = await getTranslations("portal");

  return (
    <div>
      <PortalPageHeader title={t("inquiriesTitle")} description={t("inquiriesDesc")} />
      <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        {t("inquiriesEmpty")}
      </p>
    </div>
  );
}
