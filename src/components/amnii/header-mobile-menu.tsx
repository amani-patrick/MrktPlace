"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Bell,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  X,
} from "lucide-react";
import { amniiNav } from "@/config/amnii";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getDashboardHref, getListingsHref } from "@/lib/portal-routes";
import { Link, useRouter } from "@/i18n/navigation";
import { useFavoritesContext } from "@/providers/favorites-provider";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

interface HeaderMobileMenuProps {
  isAuthenticated: boolean;
  role: UserRole | null;
}

export function HeaderMobileMenu({ isAuthenticated, role }: HeaderMobileMenuProps) {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { favoriteIds, onAuthRequired } = useFavoritesContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const dashboardHref = getDashboardHref(role);
  const listingsHref = getListingsHref(role);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const itemClass =
    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-amnii-navy transition-colors hover:bg-muted";

  return (
    <div ref={rootRef} className="relative sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "border-border text-amnii-navy",
        )}
        aria-expanded={open}
        aria-label={open ? t("closeMenu") : t("openMenu")}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 top-[72px] z-40 bg-black/20"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-[72px] z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-b border-border bg-white px-4 py-4 shadow-lg">
            <div className="mb-4 flex justify-center">
              <LanguageSwitcher />
            </div>

            <nav className="mb-4 space-y-1 border-b border-border pb-4" aria-label="Main">
              {amniiNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  href={dashboardHref}
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t("dashboard")}
                </Link>
                <Link
                  href="/portal/seeker/favorites"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <Heart
                    className={cn(
                      "size-5",
                      favoriteIds.length > 0
                        ? "fill-red-400 text-red-400"
                        : "text-muted-foreground",
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{t("savedListings")}</span>
                  {favoriteIds.length > 0 ? (
                    <span className="rounded-full bg-amnii-gold px-2 py-0.5 text-xs font-bold text-amnii-navy">
                      {favoriteIds.length > 9 ? "9+" : favoriteIds.length}
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/portal/seeker/notifications"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <Bell className="size-5 text-muted-foreground" aria-hidden="true" />
                  {tCommon("notifications")}
                </Link>
                {listingsHref ? (
                  <Link
                    href={listingsHref}
                    className={itemClass}
                    onClick={() => setOpen(false)}
                  >
                    <LayoutDashboard className="size-5 text-muted-foreground" aria-hidden="true" />
                    {t("myListings")}
                  </Link>
                ) : null}
                <Link href="/" className={itemClass} onClick={() => setOpen(false)}>
                  <Home className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t("home")}
                </Link>
                <Link
                  href="/portal"
                  className={itemClass}
                  onClick={() => setOpen(false)}
                >
                  <RefreshCw className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t("switchWorkspace")}
                </Link>
                <button type="button" className={itemClass} onClick={signOut}>
                  <LogOut className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  className={itemClass}
                  onClick={() => {
                    setOpen(false);
                    onAuthRequired("favorite");
                  }}
                >
                  <Heart className="size-5 text-muted-foreground" aria-hidden="true" />
                  {t("savedListings")}
                </button>
                <Link
                  href="/login"
                  className={cn(itemClass, "bg-amnii-navy/5 font-semibold")}
                  onClick={() => setOpen(false)}
                >
                  {t("signIn")}
                </Link>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
