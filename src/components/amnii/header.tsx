import { Bell, Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { amniiNav } from "@/config/amnii";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AmniiLogo } from "./logo";
import { HeaderAuth } from "./header-auth";
import { LanguageSwitcher } from "./language-switcher";

export async function AmniiHeader() {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? null;

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

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
            aria-label={tCommon("savedProperties")}
          >
            <Heart className="size-5" />
          </button>
          <button
            type="button"
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
            aria-label={tCommon("notifications")}
          >
            <Bell className="size-5" />
          </button>
          <HeaderAuth email={email} />
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
            )}
          >
            {t("listProperty")}
          </Link>
        </div>
      </div>
    </header>
  );
}
