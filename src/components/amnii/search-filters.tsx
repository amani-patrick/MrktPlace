"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { POPULAR_DISTRICTS } from "@/config/constants";
import { useRouter } from "@/i18n/navigation";

const propertyTypeKeys = ["", "apartment", "house", "room", "studio", "office", "land"] as const;
const bedroomOptions = ["", "1", "2", "3", "4+"];

export function AmniiSearchFilters() {
  const t = useTranslations("search");
  const tCommon = useTranslations("common");
  const tHero = useTranslations("hero");
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/search?${params.toString()}`);
  }

  const current = {
    type: searchParams.get("type") ?? "",
    property: searchParams.get("property") ?? "",
    district: searchParams.get("district") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    verified: searchParams.get("verified") ?? "",
    q: searchParams.get("q") ?? "",
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("filters")}</h2>
        <p className="text-sm text-muted-foreground">{t("filtersDesc")}</p>
      </div>

      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("location")}</span>
          <input
            type="text"
            defaultValue={current.q}
            placeholder={t("locationPlaceholder")}
            onBlur={(e) => update("q", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("listingType")}</span>
          <select
            value={current.type}
            onChange={(e) => update("type", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            <option value="">{t("all")}</option>
            <option value="rent">{tHero("rent")}</option>
            <option value="sale">{tHero("buy")}</option>
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("district")}</span>
          <select
            value={current.district}
            onChange={(e) => update("district", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            <option value="">{t("allDistricts")}</option>
            {POPULAR_DISTRICTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("propertyType")}</span>
          <select
            value={current.property}
            onChange={(e) => update("property", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            <option value="">{tHero("allTypes")}</option>
            {propertyTypeKeys.filter(Boolean).map((key) => (
              <option key={key} value={key}>
                {tCommon(key)}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("bedrooms")}</span>
          <select
            value={current.bedrooms}
            onChange={(e) => update("bedrooms", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold"
          >
            {bedroomOptions.map((b) => (
              <option key={b} value={b}>
                {b ? b : t("any")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={current.verified === "true"}
            onChange={(e) => update("verified", e.target.checked ? "true" : "")}
            className="size-4 rounded border-border accent-amnii-gold"
          />
          <span className="text-sm font-medium text-amnii-navy">{t("verifiedOnly")}</span>
        </label>
      </div>

      <button
        type="button"
        onClick={() => router.push("/search")}
        className="w-full rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
      >
        {t("clearFilters")}
      </button>
    </aside>
  );
}
