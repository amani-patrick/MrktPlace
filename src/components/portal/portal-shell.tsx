"use client";

import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import type { PortalConfig } from "@/config/portal";
import { PORTAL_NAV } from "@/config/portal-nav";
import { AmniiLogo } from "@/components/amnii/logo";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface PortalShellProps {
  config: PortalConfig;
  children: React.ReactNode;
  /** Hide specific nav links (e.g. recent searches until enough history). */
  hideNavHrefs?: string[];
}

export function PortalShell({ config, children, hideNavHrefs = [] }: PortalShellProps) {
  const t = useTranslations("portal");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hidden = new Set(hideNavHrefs);
  const nav = PORTAL_NAV[config.role].filter((item) => !hidden.has(item.href));

  const descriptionKey =
    config.role === "owner"
      ? "ownerOverviewDesc"
      : config.role === "agent"
        ? "agentOverviewDesc"
        : "seekerOverviewDesc";

  return (
    <div className="flex min-h-screen flex-col bg-amnii-cream/40">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-amnii-navy"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t("marketplace")}</span>
            </Link>
            <span className="hidden h-4 w-px bg-border sm:block" />
            <div className="hidden sm:block">
              <AmniiLogo />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={cn(
                "hidden rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex",
                config.accentMuted,
                config.accentClass,
              )}
            >
              {config.role === "seeker"
                ? t("seeker")
                : config.role === "owner"
                  ? t("owner")
                  : t("agent")}
            </span>
            <Link
              href="/portal"
              className="hidden text-sm font-medium text-muted-foreground hover:text-amnii-navy md:inline"
            >
              {t("switchRole")}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="border-t border-border bg-white px-4 py-3 lg:hidden">
            {nav.map((item) => {
              const isActive =
                pathname.endsWith(item.href) ||
                (item.href !== `/portal/${config.role}` &&
                  pathname.includes(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive
                      ? cn(config.accentBg, "text-white", config.role === "owner" && "text-amnii-navy")
                      : "text-muted-foreground",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1" aria-label="Portal navigation">
            {nav.map((item) => {
              const isActive =
                pathname.endsWith(item.href) ||
                (item.href !== `/portal/${config.role}` &&
                  pathname.includes(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? cn(
                          config.accentBg,
                          "text-white shadow-sm",
                          config.role === "owner" && "text-amnii-navy",
                        )
                      : "text-muted-foreground hover:bg-white hover:text-amnii-navy",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-6 rounded-2xl border bg-white p-4 shadow-sm",
              config.accentRing,
              "ring-1",
            )}
          >
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {t("workspace")}
            </p>
            <p className={cn("mt-1 font-semibold capitalize", config.accentClass)}>
              {config.role === "seeker"
                ? t("seeker")
                : config.role === "owner"
                  ? t("owner")
                  : t("agent")}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t(descriptionKey)}
            </p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
