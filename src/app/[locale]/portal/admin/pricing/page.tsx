import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/format";
import { getPriceIntelligence } from "@/lib/data/analytics";

export const metadata = { title: "Admin — Pricing" };

export default async function AdminPricingPage() {
  const t = await getTranslations("admin");
  const rows = await getPriceIntelligence();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("pricingTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("pricingDesc")}</p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("pricingEmpty")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="px-4 py-3 font-medium">{t("signupDistrict")}</th>
                <th className="px-4 py-3 font-medium">{t("pricingType")}</th>
                <th className="px-4 py-3 font-medium">{t("pricingListingType")}</th>
                <th className="px-4 py-3 font-medium">{t("pricingCount")}</th>
                <th className="px-4 py-3 font-medium">{t("pricingMedian")}</th>
                <th className="px-4 py-3 font-medium">{t("pricingRange")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.district}-${row.propertyType}-${row.listingType}`} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-medium">{row.district}</td>
                  <td className="px-4 py-3 capitalize">{row.propertyType}</td>
                  <td className="px-4 py-3 capitalize">{row.listingType}</td>
                  <td className="px-4 py-3">{row.count}</td>
                  <td className="px-4 py-3">{formatPrice(row.medianPrice, "RWF")}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {formatPrice(row.minPrice, "RWF")} – {formatPrice(row.maxPrice, "RWF")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
