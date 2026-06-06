import { getTranslations } from "next-intl/server";
import { AgentOnboardingForm } from "@/components/portal/agent-onboarding-form";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { getAgentOnboardingStatus } from "@/app/actions/agent-onboarding";

export async function generateMetadata() {
  const t = await getTranslations("agentOnboarding");
  return { title: t("title") };
}

export default async function AgentOnboardingPage() {
  const t = await getTranslations("agentOnboarding");
  const status = await getAgentOnboardingStatus();

  return (
    <div>
      <PortalPageHeader title={t("title")} description={t("desc")} />
      <AgentOnboardingForm
        initial={
          status
            ? {
                agency: status.agency ?? "",
                district: status.district ?? "",
                servesIn: status.serves_in ?? [],
                languages: status.languages ?? [],
                bio: status.bio ?? "",
                licenseNumber: status.license_number ?? "",
                licenseDocUrl: status.license_doc_url ?? "",
                idDocUrl: status.id_doc_url ?? "",
                yearsExperience: status.years_experience ?? 1,
                whatsapp: status.whatsapp ?? "",
                onboarding_status: status.onboarding_status,
                rejection_reason: status.rejection_reason,
              }
            : null
        }
      />
    </div>
  );
}
