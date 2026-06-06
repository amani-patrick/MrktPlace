import { getTranslations } from "next-intl/server";
import {
  dismissReport,
  suspendListingFromReport,
} from "@/app/actions/admin";
import { ReportActions } from "@/components/admin/admin-actions";
import { getAdminReports } from "@/lib/data/admin";

export const metadata = { title: "Admin — Reports" };

export default async function AdminReportsPage() {
  const t = await getTranslations("admin");
  const reports = await getAdminReports();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("reportsTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("reportsDesc")}</p>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noOpenReports")}
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
                  <p className="font-semibold text-slate-900">{r.listingTitle}</p>
                  <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                  {r.details ? (
                    <p className="mt-1 text-xs text-slate-500">{r.details}</p>
                  ) : null}
                  <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 capitalize">
                    {r.status}
                  </span>
                </div>
                <ReportActions
                  reportId={r.id}
                  listingId={r.listingId}
                  dismiss={dismissReport}
                  suspendListing={suspendListingFromReport}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
