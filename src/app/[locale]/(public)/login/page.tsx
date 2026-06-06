"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Mail, ShieldCheck } from "lucide-react";
import { SignupSurveyFields } from "@/components/auth/signup-survey-fields";
import { getStoredUtm } from "@/components/analytics/utm-capture";
import { Button } from "@/components/ui/button";
import type { LookingFor, ReferralSource } from "@/config/signup";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/i18n/navigation";
import { stripLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

function LoginForm() {
  const t = useTranslations("login");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [intent, setIntent] = useState<"seeker" | "owner" | "agent">("seeker");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralSource, setReferralSource] = useState<ReferralSource | "">("");
  const [referralOther, setReferralOther] = useState("");
  const [primaryDistrict, setPrimaryDistrict] = useState("");
  const [lookingFor, setLookingFor] = useState<LookingFor | "">("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function validateSignup(): string | null {
    if (!referralSource) return t("referralRequired");
    if (referralSource === "other" && !referralOther.trim()) return t("referralOtherRequired");
    if (!primaryDistrict) return t("districtRequired");
    if (intent === "seeker" && !lookingFor) return t("lookingForRequired");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const validationError = validateSignup();
      if (validationError) {
        setLoading(false);
        setError(validationError);
        return;
      }

      const utm = getStoredUtm();

      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: intent,
            referral_source: referralSource,
            referral_source_other:
              referralSource === "other" ? referralOther.trim() : undefined,
            primary_district: primaryDistrict,
            looking_for: intent === "seeker" ? lookingFor : undefined,
            phone: phone.trim() || undefined,
            locale,
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setLoading(false);
      if (err) {
        setError(err.message);
        return;
      }
      setMessage(t("verifyEmail"));
      setMode("signin");
      return;
    }

    const { data: authData, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }

    let destination = stripLocale(next);
    if (authData.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (destination === "/" || destination.startsWith("/login")) {
        if (profile?.role === "admin") destination = "/portal/admin";
        else if (profile?.role === "agent") destination = "/portal/agent/onboarding";
        else if (profile?.role === "owner") destination = "/portal/owner";
        else if (profile?.role === "seeker") destination = "/portal/seeker/preferences";
      }
    }

    router.push(destination);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
          <Mail className="size-6" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-amnii-navy">
          {mode === "signin" ? t("signIn") : t("signUp")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("noAccountNeeded")}</p>
        <p className="mt-1 text-xs font-medium text-amnii-gold-dark">{t("accountBenefits")}</p>

        <div className="mt-5 flex rounded-lg bg-muted p-1">
          {(["signin", "signup"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setMode(tab);
                setError(null);
                setMessage(null);
              }}
              className={cn(
                "flex-1 rounded-md py-2 text-sm font-medium transition-colors",
                mode === tab
                  ? "bg-white text-amnii-navy shadow-sm"
                  : "text-muted-foreground hover:text-amnii-navy",
              )}
            >
              {tab === "signin" ? t("signIn") : t("signUp")}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" ? (
            <>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">{t("intentLabel")}</legend>
                {(
                  [
                    { value: "seeker", label: t("intentSeeker"), desc: t("intentSeekerDesc") },
                    { value: "owner", label: t("intentOwner"), desc: t("intentOwnerDesc") },
                    { value: "agent", label: t("intentAgent"), desc: t("intentAgentDesc") },
                  ] as const
                ).map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
                      intent === option.value
                        ? "border-amnii-gold bg-amnii-cream/60"
                        : "border-border hover:border-amnii-gold/50",
                    )}
                  >
                    <input
                      type="radio"
                      name="intent"
                      value={option.value}
                      checked={intent === option.value}
                      onChange={() => setIntent(option.value)}
                      className="mt-1 accent-amnii-gold"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-amnii-navy">
                        {option.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{option.desc}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">
                  {t("fullName")} <span className="text-destructive">*</span>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("fullName")}
                  required
                  className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
                />
              </label>
              <SignupSurveyFields
                referralSource={referralSource}
                referralOther={referralOther}
                primaryDistrict={primaryDistrict}
                lookingFor={lookingFor}
                phone={phone}
                showLookingFor={intent === "seeker"}
                onReferralSourceChange={setReferralSource}
                onReferralOtherChange={setReferralOther}
                onPrimaryDistrictChange={setPrimaryDistrict}
                onLookingForChange={setLookingFor}
                onPhoneChange={setPhone}
              />
            </>
          ) : null}

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("email")}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("password")}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-amnii-gold-dark">{message}</p> : null}

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white"
          >
            {loading
              ? t("pleaseWait")
              : mode === "signin"
                ? t("signInBtn")
                : t("signUpBtn")}
          </Button>
        </form>

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-amnii-cream px-3 py-2.5 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-amnii-gold" aria-hidden="true" />
          {t("trustNote")}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/" className="hover:text-amnii-gold-dark">
          {t("backHome")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  const tCommon = useTranslations("common");

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-muted-foreground">{tCommon("loading")}</div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
