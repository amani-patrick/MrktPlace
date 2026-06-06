import { getTranslations } from "next-intl/server";
import { PreferencesForm } from "@/components/portal/preferences-form";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { getUserPreferences } from "@/app/actions/preferences";

export async function generateMetadata() {
  const t = await getTranslations("preferences");
  return { title: t("title") };
}

export default async function SeekerPreferencesPage() {
  const t = await getTranslations("preferences");
  const prefs = await getUserPreferences();

  return (
    <div>
      <PortalPageHeader title={t("title")} description={t("desc")} />
      <PreferencesForm initial={prefs} />
    </div>
  );
}
