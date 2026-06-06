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
}

export function DistrictSelect({ value, onChange, required, className }: DistrictSelectProps) {
  const t = useTranslations("districts");

  const options = useMemo(
    () =>
      RWANDA_DISTRICTS.map((d) => ({
        value: d.name,
        label: d.name,
        group: d.province,
        featured: d.featured,
      })).sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.label.localeCompare(b.label);
      }),
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
      required={required}
      className={className}
    />
  );
}
