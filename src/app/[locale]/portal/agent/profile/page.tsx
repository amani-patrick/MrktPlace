import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("agentProfileTitle") };
}

export default async function AgentProfilePage() {
  const t = await getTranslations("portal");

  return (
    <div>
      <PortalPageHeader title={t("agentProfileTitle")} description={t("agentProfileDesc")} />
      <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        {t("agentProfileDesc")}
      </p>
    </div>
  );
}
