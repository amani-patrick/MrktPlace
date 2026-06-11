"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { RWANDA_DISTRICTS } from "@/config/districts";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface DistrictSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  /** Allow a district name not in the official 30-district list */
  allowCustom?: boolean;
}

export function DistrictSelect({
  value,
  onChange,
  required,
  className,
  allowCustom = false,
}: DistrictSelectProps) {
  const t = useTranslations("districts");
  const tSelect = useTranslations("searchableSelect");

  const options = useMemo(
    () =>
      RWANDA_DISTRICTS.map((d) => ({
        value: d.name,
        label: d.name,
        group: d.province,
        featured: d.featured,
      })),
    [],
  );

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t("placeholder")}
      searchPlaceholder={t("search")}
      emptyLabel={t("empty")}
      searchHint={t("featuredHint")}
      loadMoreLabel={tSelect("loadMore")}
      useCustomLabel={(v) => tSelect("useCustom", { value: v })}
      required={required}
      className={className}
      pageSize={8}
      allowCustom={allowCustom}
    />
  );
}
