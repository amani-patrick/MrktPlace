import { Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { amniiNav } from "@/config/amnii";
import { buttonVariants } from "@/components/ui/button";
import { getDisplayName } from "@/lib/display-name";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AmniiLogo } from "./logo";
import { HeaderAccountMenu } from "./header-account-menu";
import { HeaderFavorites } from "./header-favorites";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { LanguageSwitcher } from "./language-switcher";

export async function AmniiHeader() {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? null;
  let displayName: string | null = null;
  let role: UserRole | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();

    displayName = getDisplayName(profile?.full_name, user.email);
    role = profile?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <AmniiLogo />

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex" aria-label="Main">
          {amniiNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-amnii-navy"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <HeaderFavorites />
          {email ? (
            <Link
              href="/portal/seeker/notifications"
              className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
              aria-label={tCommon("notifications")}
            >
              <Bell className="size-5" />
            </Link>
          ) : (
            <button
              type="button"
              className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
              aria-label={tCommon("notifications")}
              disabled
            >
              <Bell className="size-5 opacity-40" />
            </button>
          )}
          <HeaderAccountMenu email={email} displayName={displayName} role={role} />
          <HeaderMobileMenu isAuthenticated={Boolean(email)} role={role} />
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "shrink-0 bg-amnii-gold px-2.5 font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white sm:px-3",
            )}
          >
            <span className="hidden min-[400px]:inline">{t("listProperty")}</span>
            <span className="min-[400px]:hidden">{t("listPropertyShort")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
