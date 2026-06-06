import { getTranslations } from "next-intl/server";
import {
  dismissAgentReport,
  suspendAgentFromReport,
} from "@/app/actions/admin";
import { AgentReportActions } from "@/components/admin/admin-actions";
import { getAdminAgentReports } from "@/lib/data/admin";

export const metadata = { title: "Admin — Agent Reports" };

export default async function AdminAgentReportsPage() {
  const t = await getTranslations("admin");
  const reports = await getAdminAgentReports();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">
          {t("agentReportsTitle")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("agentReportsDesc")}</p>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noAgentReports")}
        </p>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {r.agentName}
                    {r.agency ? (
                      <span className="font-normal text-slate-500"> · {r.agency}</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                  {r.details ? (
                    <p className="mt-1 text-xs text-slate-500">{r.details}</p>
                  ) : null}
                  <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 capitalize">
                    {r.status}
                  </span>
                </div>
                <AgentReportActions
                  reportId={r.id}
                  agentId={r.agentId}
                  dismiss={dismissAgentReport}
                  suspendAgent={suspendAgentFromReport}
                  dismissLabel={t("dismissReport")}
                  suspendLabel={t("suspendAgent")}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
