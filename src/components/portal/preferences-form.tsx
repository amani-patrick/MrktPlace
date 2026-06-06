"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { DistrictSelect } from "@/components/amnii/district-select";
import { saveUserPreferences } from "@/app/actions/preferences";
import { Button } from "@/components/ui/button";
const PROPERTY_TYPES = ["apartment", "house", "room", "studio"] as const;

interface PreferencesFormProps {
  initial?: {
    preferred_listing_type?: string | null;
    preferred_districts?: string[];
    preferred_property_types?: string[];
    max_budget?: number | null;
    alerts_enabled?: boolean;
  } | null;
}

export function PreferencesForm({ initial }: PreferencesFormProps) {
  const t = useTranslations("preferences");
  const tCommon = useTranslations("common");
  const [listingType, setListingType] = useState<"rent" | "sale" | "both">(
    (initial?.preferred_listing_type as "rent" | "sale" | "both") ?? "rent",
  );
  const [districts, setDistricts] = useState<string[]>(initial?.preferred_districts ?? []);
  const [propertyTypes, setPropertyTypes] = useState<string[]>(
    initial?.preferred_property_types ?? [],
  );
  const [maxBudget, setMaxBudget] = useState(
    initial?.max_budget ? String(initial.max_budget) : "",
  );
  const [alertsEnabled, setAlertsEnabled] = useState(Boolean(initial?.alerts_enabled));
  const [districtPick, setDistrictPick] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggle(list: string[], value: string, setter: (v: string[]) => void) {
    setter(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await saveUserPreferences({
        preferredListingType: listingType,
        preferredDistricts: districts,
        preferredPropertyTypes: propertyTypes,
        maxBudget: maxBudget ? Number(maxBudget) : null,
        alertsEnabled,
      });
      setSaved(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6 rounded-2xl border border-border bg-white p-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-amnii-navy">{t("title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("desc")}</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">{t("listingType")}</span>
        <select
          value={listingType}
          onChange={(e) => setListingType(e.target.value as "rent" | "sale" | "both")}
          className="h-10 w-full rounded-lg border border-border px-3 text-sm"
        >
          <option value="rent">{t("rent")}</option>
          <option value="sale">{t("buy")}</option>
          <option value="both">{t("both")}</option>
        </select>
      </label>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{t("districts")}</legend>
        <DistrictSelect
          value={districtPick}
          onChange={(d) => {
            if (d && !districts.includes(d)) setDistricts([...districts, d]);
            setDistrictPick("");
          }}
        />
        <div className="flex flex-wrap gap-2">
          {districts.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDistricts(districts.filter((x) => x !== d))}
              className="rounded-full bg-amnii-navy px-3 py-1 text-sm text-white"
            >
              {d} ×
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">{t("propertyTypes")}</legend>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => toggle(propertyTypes, p, setPropertyTypes)}
              className={`rounded-full px-3 py-1 text-sm ${propertyTypes.includes(p) ? "bg-amnii-gold text-amnii-navy" : "border border-border"}`}
            >
              {tCommon(p)}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block space-y-2">
        <span className="text-sm font-medium">{t("maxBudget")}</span>
        <input
          type="number"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          placeholder="1500000"
          className="h-10 w-full rounded-lg border border-border px-3 text-sm"
        />
      </label>

      <label className="flex items-start gap-3 rounded-lg border border-border bg-amnii-cream/40 p-4">
        <input
          type="checkbox"
          checked={alertsEnabled}
          onChange={(e) => setAlertsEnabled(e.target.checked)}
          className="mt-1 size-4 accent-amnii-gold"
        />
        <span>
          <span className="block text-sm font-medium text-amnii-navy">{t("alerts")}</span>
          <span className="block text-xs text-muted-foreground">{t("alertsHint")}</span>
        </span>
      </label>

      {saved ? <p className="text-sm text-amnii-gold-dark">{t("saved")}</p> : null}

      <Button type="submit" disabled={pending} className="bg-amnii-gold font-semibold text-amnii-navy">
        {pending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
