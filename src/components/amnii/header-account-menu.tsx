"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getDashboardHref, getListingsHref } from "@/lib/portal-routes";
import { Link, useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

interface HeaderAccountMenuProps {
  email: string | null;
  displayName?: string | null;
  role?: UserRole | null;
}

export function HeaderAccountMenu({ email, displayName, role }: HeaderAccountMenuProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hidden font-semibold text-amnii-navy sm:inline-flex",
        )}
      >
        {t("signIn")}
      </Link>
    );
  }

  const dashboardHref = getDashboardHref(role);
  const listingsHref = getListingsHref(role);
  const label = displayName ?? email;
  const display =
    label && label.length > 22 ? `${label.slice(0, 20)}…` : (label ?? "");

  const menuLinkClass =
    "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-amnii-navy transition-colors hover:bg-muted";

  return (
    <div ref={rootRef} className="relative hidden items-center gap-2 sm:flex">
      <Link
        href={dashboardHref}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "gap-1.5 border-amnii-navy/15 font-semibold text-amnii-navy hover:bg-amnii-navy/5",
        )}
      >
        <LayoutDashboard className="size-4" aria-hidden="true" />
        {t("dashboard")}
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "max-w-[180px] gap-1 font-medium text-muted-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="truncate">{display}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-border bg-white p-1.5 shadow-lg"
        >
          <Link href="/" role="menuitem" className={menuLinkClass} onClick={() => setOpen(false)}>
            <Home className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("home")}
          </Link>
          <Link
            href={dashboardHref}
            role="menuitem"
            className={menuLinkClass}
            onClick={() => setOpen(false)}
          >
            <LayoutDashboard className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("dashboard")}
          </Link>
          <Link
            href="/portal/seeker/favorites"
            role="menuitem"
            className={menuLinkClass}
            onClick={() => setOpen(false)}
          >
            <Heart className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("savedListings")}
          </Link>
          {listingsHref ? (
            <Link
              href={listingsHref}
              role="menuitem"
              className={menuLinkClass}
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="size-4 text-muted-foreground" aria-hidden="true" />
              {t("myListings")}
            </Link>
          ) : null}
          <Link
            href="/portal"
            role="menuitem"
            className={menuLinkClass}
            onClick={() => setOpen(false)}
          >
            <RefreshCw className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("switchWorkspace")}
          </Link>
          <div className="my-1 h-px bg-border" />
          <button type="button" role="menuitem" className={menuLinkClass} onClick={signOut}>
            <LogOut className="size-4 text-muted-foreground" aria-hidden="true" />
            {t("signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
