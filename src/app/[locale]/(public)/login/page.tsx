"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/i18n/navigation";
import { stripLocale } from "@/i18n/path";
import { cn } from "@/lib/utils";

function LoginForm() {
  const t = useTranslations("login");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim(), role: "owner" },
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

      if (
        profile?.role === "admin" &&
        (destination === "/" || destination.startsWith("/login"))
      ) {
        destination = "/portal/admin";
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
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">{t("fullName")}</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("fullName")}
                required
                className="h-11 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
              />
            </label>
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
