"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={cn(
        "inline-flex rounded-lg border border-border bg-muted/50 p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
            locale === loc
              ? "bg-white text-amnii-navy shadow-sm"
              : "text-muted-foreground hover:text-amnii-navy",
          )}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
