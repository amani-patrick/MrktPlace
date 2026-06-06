import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("notificationsTitle") };
}

export default async function SeekerNotificationsPage() {
  const t = await getTranslations("portal");

  return (
    <div>
      <PortalPageHeader title={t("notificationsTitle")} description={t("notificationsDesc")} />
      <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        {t("notificationsEmpty")}
      </p>
    </div>
  );
}
