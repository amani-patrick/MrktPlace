"use client";

import { useTranslations } from "next-intl";
import {
  LOOKING_FOR_OPTIONS,
  REFERRAL_SOURCES,
  SIGNUP_DISTRICTS,
  type LookingFor,
  type ReferralSource,
} from "@/config/signup";
import { cn } from "@/lib/utils";

interface SignupSurveyFieldsProps {
  referralSource: ReferralSource | "";
  referralOther: string;
  primaryDistrict: string;
  lookingFor: LookingFor | "";
  phone: string;
  showLookingFor: boolean;
  onReferralSourceChange: (value: ReferralSource) => void;
  onReferralOtherChange: (value: string) => void;
  onPrimaryDistrictChange: (value: string) => void;
  onLookingForChange: (value: LookingFor) => void;
  onPhoneChange: (value: string) => void;
}

export function SignupSurveyFields({
  referralSource,
  referralOther,
  primaryDistrict,
  lookingFor,
  phone,
  showLookingFor,
  onReferralSourceChange,
  onReferralOtherChange,
  onPrimaryDistrictChange,
  onLookingForChange,
  onPhoneChange,
}: SignupSurveyFieldsProps) {
  const t = useTranslations("login");

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          {t("referralLabel")} <span className="text-destructive">*</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {REFERRAL_SOURCES.map((source) => (
            <label
              key={source}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                referralSource === source
                  ? "border-amnii-gold bg-amnii-cream/60"
                  : "border-border hover:border-amnii-gold/50",
              )}
            >
              <input
                type="radio"
                name="referral"
                value={source}
                checked={referralSource === source}
                onChange={() => onReferralSourceChange(source)}
                className="accent-amnii-gold"
                required
              />
              {t(`referral_${source}`)}
            </label>
          ))}
        </div>
      </fieldset>

      {referralSource === "other" ? (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">
            {t("referralOtherLabel")} <span className="text-destructive">*</span>
          </span>
          <input
            type="text"
            value={referralOther}
            onChange={(e) => onReferralOtherChange(e.target.value)}
            placeholder={t("referralOtherPlaceholder")}
            required
            className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
          />
        </label>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">
          {t("districtLabel")} <span className="text-destructive">*</span>
        </span>
        <select
          value={primaryDistrict}
          onChange={(e) => onPrimaryDistrictChange(e.target.value)}
          required
          className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
        >
          <option value="">{t("districtPlaceholder")}</option>
          {SIGNUP_DISTRICTS.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">{t("districtHint")}</p>
      </label>

      {showLookingFor ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">
            {t("lookingForLabel")} <span className="text-destructive">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((option) => (
              <label
                key={option}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                  lookingFor === option
                    ? "border-amnii-gold bg-amnii-cream/60 font-medium text-amnii-navy"
                    : "border-border hover:border-amnii-gold/50",
                )}
              >
                <input
                  type="radio"
                  name="lookingFor"
                  value={option}
                  checked={lookingFor === option}
                  onChange={() => onLookingForChange(option)}
                  className="accent-amnii-gold"
                  required
                />
                {t(`lookingFor_${option}`)}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <label className="block space-y-1.5">
        <span className="text-sm font-medium">{t("phoneLabel")}</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder={t("phonePlaceholder")}
          className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
        />
        <p className="text-xs text-muted-foreground">{t("phoneHint")}</p>
      </label>
    </div>
  );
}
