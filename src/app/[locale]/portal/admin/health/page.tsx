import { getTranslations } from "next-intl/server";
import { getPlatformHealth } from "@/lib/data/analytics";

export const metadata = { title: "Admin — Health" };

export default async function AdminHealthPage() {
  const t = await getTranslations("admin");
  const health = await getPlatformHealth();

  const stats = [
    { label: t("healthSignups"), value: health.signups7d },
    { label: t("healthActiveListings"), value: health.activeListings },
    { label: t("healthPending"), value: health.pendingListings },
    { label: t("healthContacts"), value: health.contacts7d },
    { label: t("healthSearches"), value: health.searches7d },
    { label: t("healthReviews"), value: health.reviews7d },
    { label: t("healthReports"), value: health.openReports },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("healthTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("healthDesc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="font-heading text-3xl font-bold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{t("healthTopDistricts")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {health.topDistricts.length === 0 ? (
              <li className="text-slate-500">{t("healthNoData")}</li>
            ) : (
              health.topDistricts.map((d) => (
                <li key={d.district} className="flex justify-between">
                  <span>{d.district}</span>
                  <span className="font-semibold">{d.count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">{t("healthTopReferrals")}</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {health.topReferrals.length === 0 ? (
              <li className="text-slate-500">{t("healthNoData")}</li>
            ) : (
              health.topReferrals.map((r) => (
                <li key={r.source} className="flex justify-between capitalize">
                  <span>{r.source.replaceAll("_", " ")}</span>
                  <span className="font-semibold">{r.count}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
