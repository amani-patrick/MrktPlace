import { getTranslations } from "next-intl/server";
import { getSignupAnalytics } from "@/lib/data/admin";

export const metadata = { title: "Admin — Sign-ups" };

function InsightBar({ label, count, max }: { label: string; count: number; max: number }) {
  const width = max > 0 ? Math.round((count / max) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="capitalize text-slate-700">{label.replaceAll("_", " ")}</span>
        <span className="font-semibold text-slate-900">{count}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-amnii-gold transition-all"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default async function AdminSignupsPage() {
  const t = await getTranslations("admin");
  const analytics = await getSignupAnalytics();
  const maxReferral = analytics.byReferral[0]?.count ?? 1;
  const maxType = analytics.byAccountType[0]?.count ?? 1;
  const maxDistrict = analytics.byDistrict[0]?.count ?? 1;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("signupsTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("signupsDesc")}</p>
        <p className="mt-4 font-heading text-3xl font-bold text-slate-900">
          {analytics.total}
          <span className="ml-2 text-sm font-normal text-slate-500">{t("signupsTotal")}</span>
        </p>
      </div>

      {analytics.total === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noSignups")}
        </p>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{t("signupsByReferral")}</h2>
              <div className="mt-4 space-y-3">
                {analytics.byReferral.map((item) => (
                  <InsightBar
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    max={maxReferral}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{t("signupsByType")}</h2>
              <div className="mt-4 space-y-3">
                {analytics.byAccountType.map((item) => (
                  <InsightBar
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    max={maxType}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900">{t("signupsByDistrict")}</h2>
              <div className="mt-4 space-y-3">
                {analytics.byDistrict.map((item) => (
                  <InsightBar
                    key={item.label}
                    label={item.label}
                    count={item.count}
                    max={maxDistrict}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">{t("signupsRecent")}</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500">
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">{t("signupType")}</th>
                    <th className="pb-2 font-medium">{t("signupReferral")}</th>
                    <th className="pb-2 font-medium">{t("signupDistrict")}</th>
                    <th className="pb-2 font-medium">{t("signupLookingFor")}</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recent.map((row) => (
                    <tr key={row.userId} className="border-b border-slate-50 last:border-0">
                      <td className="py-2.5">
                        <p className="font-medium text-slate-900">
                          {row.fullName ?? row.email ?? "—"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(row.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-2.5 capitalize text-slate-600">{row.accountType}</td>
                      <td className="py-2.5 text-slate-600">
                        {row.referralSource.replaceAll("_", " ")}
                        {row.referralSourceOther ? (
                          <span className="block text-xs text-slate-400">
                            {row.referralSourceOther}
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5 text-slate-600">{row.primaryDistrict}</td>
                      <td className="py-2.5 capitalize text-slate-600">
                        {row.lookingFor ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
