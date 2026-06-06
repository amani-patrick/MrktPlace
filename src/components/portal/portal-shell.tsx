"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import type { PortalConfig } from "@/config/portal";
import { RwandaColorBar } from "@/components/layout/rwanda-color-bar";
import { cn } from "@/lib/utils";

interface PortalShellProps {
  config: PortalConfig;
  children: React.ReactNode;
}

export function PortalShell({ config, children }: PortalShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <RwandaColorBar />

      <header className="border-b border-border/70 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Back to marketplace</span>
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg font-heading text-xs font-bold text-white",
                  config.accentBg,
                  config.role === "agent" && "text-foreground",
                )}
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className={cn("text-sm font-bold leading-none", config.accentClass)}>
                  {config.title}
                </p>
                <p className="text-[11px] text-muted-foreground">Demo workspace</p>
              </div>
            </div>
          </div>

          <Link
            href="/portal"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Switch role
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav className="sticky top-6 space-y-1" aria-label="Portal navigation">
            {config.nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== `/portal/${config.role}` &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? cn(config.accentBg, "text-white shadow-sm", config.role === "agent" && "text-foreground")
                      : "text-muted-foreground hover:bg-white hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-6 rounded-xl border bg-white p-4 shadow-sm",
              config.accentRing,
              "ring-1",
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Your role
            </p>
            <p className={cn("mt-1 font-semibold capitalize", config.accentClass)}>
              {config.role}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{config.description}</p>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
