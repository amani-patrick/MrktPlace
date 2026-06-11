"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { DistrictSelect } from "@/components/amnii/district-select";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useRouter } from "@/i18n/navigation";

const propertyTypeKeys = ["", "apartment", "house", "room", "studio", "office", "land"] as const;
const bedroomOptions = ["", "1", "2", "3", "4+"];

function readFilters(searchParams: URLSearchParams) {
  return {
    q: searchParams.get("q") ?? "",
    type: searchParams.get("type") ?? "",
    district: searchParams.get("district") ?? "",
    property: searchParams.get("property") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    verified: searchParams.get("verified") === "true",
  };
}

export function AmniiSearchFilters() {
  const t = useTranslations("search");
  const tCommon = useTranslations("common");
  const tHero = useTranslations("hero");
  const tSelect = useTranslations("searchableSelect");
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  const [filters, setFilters] = useState(() => readFilters(searchParams));

  const listingTypeOptions = useMemo(
    () => [
      { value: "", label: t("all") },
      { value: "rent", label: tHero("rent") },
      { value: "sale", label: tHero("buy") },
    ],
    [t, tHero],
  );

  const propertyTypeOptions = useMemo(
    () => [
      { value: "", label: tHero("allTypes") },
      ...propertyTypeKeys
        .filter(Boolean)
        .map((key) => ({ value: key, label: tCommon(key) })),
    ],
    [tCommon, tHero],
  );

  const bedroomSelectOptions = useMemo(
    () =>
      bedroomOptions.map((b) => ({
        value: b,
        label: b ? b : t("any"),
      })),
    [t],
  );

  useEffect(() => {
    setFilters(readFilters(searchParams));
  }, [paramsKey, searchParams]);

  function setField<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function applyFilters(event?: React.FormEvent) {
    event?.preventDefault();
    const params = new URLSearchParams();

    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.type) params.set("type", filters.type);
    if (filters.district) params.set("district", filters.district);
    if (filters.property) params.set("property", filters.property);
    if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
    if (filters.minPrice) params.set("minPrice", filters.minPrice.replace(/[^\d]/g, ""));
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice.replace(/[^\d]/g, ""));
    if (filters.verified) params.set("verified", "true");

    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function clearFilters() {
    setFilters({
      q: "",
      type: "",
      district: "",
      property: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      verified: false,
    });
    router.push("/search");
  }

  return (
    <aside className="space-y-6 rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("filters")}</h2>
        <p className="text-sm text-muted-foreground">{t("filtersDesc")}</p>
      </div>

      <form onSubmit={applyFilters} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("location")}</span>
          <input
            type="search"
            enterKeyHint="search"
            value={filters.q}
            placeholder={t("locationPlaceholder")}
            onChange={(e) => setField("q", e.target.value)}
            className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("listingType")}</span>
          <SearchableSelect
            options={listingTypeOptions}
            value={filters.type}
            onChange={(v) => setField("type", v)}
            placeholder={t("all")}
            searchable={false}
            pageSize={10}
            loadMoreLabel={tSelect("loadMore")}
          />
        </label>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("district")}</span>
          <DistrictSelect
            value={filters.district}
            onChange={(v) => setField("district", v)}
          />
          {filters.district ? (
            <button
              type="button"
              onClick={() => setField("district", "")}
              className="text-xs text-amnii-gold-dark hover:underline"
            >
              {t("allDistricts")}
            </button>
          ) : null}
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("propertyType")}</span>
          <SearchableSelect
            options={propertyTypeOptions}
            value={filters.property}
            onChange={(v) => setField("property", v)}
            placeholder={tHero("allTypes")}
            searchPlaceholder={t("searchPropertyType")}
            emptyLabel={tSelect("empty")}
            searchHint={tSelect("searchHint", { total: propertyTypeOptions.length - 1 })}
            loadMoreLabel={tSelect("loadMore")}
            pageSize={6}
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-amnii-navy">{t("bedrooms")}</span>
          <SearchableSelect
            options={bedroomSelectOptions}
            value={filters.bedrooms}
            onChange={(v) => setField("bedrooms", v)}
            placeholder={t("any")}
            searchPlaceholder={t("searchBedrooms")}
            emptyLabel={tSelect("empty")}
            searchable={bedroomSelectOptions.length > 6}
            pageSize={6}
            loadMoreLabel={tSelect("loadMore")}
          />
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
                enterKeyHint="search"
                value={filters.minPrice}
                placeholder={t("minPricePlaceholder")}
                onChange={(e) => setField("minPrice", e.target.value.replace(/[^\d]/g, ""))}
                className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-muted-foreground">{t("maxPrice")}</span>
              <input
                type="text"
                inputMode="numeric"
                enterKeyHint="search"
                value={filters.maxPrice}
                placeholder={t("maxPricePlaceholder")}
                onChange={(e) => setField("maxPrice", e.target.value.replace(/[^\d]/g, ""))}
                className="h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </label>
          </div>
        </fieldset>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => setField("verified", e.target.checked)}
            className="size-4 rounded border-border accent-amnii-gold"
          />
          <span className="text-sm font-medium text-amnii-navy">{t("verifiedOnly")}</span>
        </label>

        <div className="sticky bottom-4 z-10 space-y-2 bg-white pt-2 lg:static lg:bottom-auto lg:pt-0">
          <Button
            type="submit"
            className="h-11 w-full gap-2 bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white"
          >
            <Search className="size-4" aria-hidden="true" />
            {t("applyFilters")}
          </Button>
          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            {t("clearFilters")}
          </button>
        </div>
      </form>
    </aside>
  );
}
