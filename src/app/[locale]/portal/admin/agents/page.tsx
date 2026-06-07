import { getTranslations } from "next-intl/server";
import { AgentOnboardingActions } from "@/components/admin/admin-actions";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin — Agents" };

export default async function AdminAgentsPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data: agents } = await supabase
    .from("agent_profiles")
    .select(
      "id, agency, district, license_number, license_doc_url, id_doc_url, years_experience, onboarding_status, profiles ( full_name, email )",
    )
    .in("onboarding_status", ["submitted", "rejected"])
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("agentsTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("agentsDesc")}</p>
      </div>

      {!agents?.length ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noAgentApplications")}
        </p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => {
            const profiles = agent.profiles as
              | { full_name: string | null; email: string | null }
              | { full_name: string | null; email: string | null }[]
              | null;
            const profile = Array.isArray(profiles) ? profiles[0] : profiles;

            return (
              <div
                key={agent.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="font-semibold text-slate-900">
                  {profile?.full_name ?? profile?.email ?? "Agent"}
                </p>
                <p className="text-sm text-slate-500">
                  {agent.agency} · {agent.district} · {agent.years_experience}y exp
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  License: {agent.license_number} ·{" "}
                  <a href={agent.license_doc_url ?? "#"} className="underline" target="_blank" rel="noreferrer">
                    {t("viewLicense")}
                  </a>{" "}
                  ·{" "}
                  <a href={agent.id_doc_url ?? "#"} className="underline" target="_blank" rel="noreferrer">
                    {t("viewId")}
                  </a>
                </p>
                <div className="mt-3">
                  <AgentOnboardingActions
                    agentId={agent.id}
                    approveLabel={t("approveAgent")}
                    rejectLabel={t("rejectAgent")}
                    rejectReason="Documents did not pass review"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
