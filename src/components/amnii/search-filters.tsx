"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { DistrictSelect } from "@/components/amnii/district-select";
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
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
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

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("district")}</span>
          <DistrictSelect
            value={current.district}
            onChange={(v) => update("district", v)}
          />
          {current.district ? (
            <button
              type="button"
              onClick={() => update("district", "")}
              className="text-xs text-amnii-gold-dark hover:underline"
            >
              {t("allDistricts")}
            </button>
          ) : null}
        </div>

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

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-amnii-navy">{t("priceRange")}</legend>
          <p className="text-xs text-muted-foreground">{t("priceCurrencyNote")}</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{t("minPrice")}</span>
              <input
                type="text"
                inputMode="numeric"
                defaultValue={current.minPrice}
                placeholder={t("minPricePlaceholder")}
                onBlur={(e) => update("minPrice", e.target.value.replace(/[^\d]/g, ""))}
                className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{t("maxPrice")}</span>
              <input
                type="text"
                inputMode="numeric"
                defaultValue={current.maxPrice}
                placeholder={t("maxPricePlaceholder")}
                onBlur={(e) => update("maxPrice", e.target.value.replace(/[^\d]/g, ""))}
                className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </label>
          </div>
        </fieldset>

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
