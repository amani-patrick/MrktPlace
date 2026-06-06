import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import {
  getRecentSearches,
  getSearchEventCount,
  shouldShowRecentSearchesNav,
} from "@/lib/data/searches";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("searchesTitle") };
}

function formatWhen(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default async function SeekerSearchesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("portal");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const searchCount = user ? await getSearchEventCount(user.id) : 0;
  const searches = user ? await getRecentSearches(user.id) : [];
  const navUnlocked = shouldShowRecentSearchesNav(searchCount);

  return (
    <div>
      <PortalPageHeader title={t("searchesTitle")} description={t("searchesDesc")} />
      {!navUnlocked ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
          {t("searchesLocked")}
        </p>
      ) : searches.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
          {t("searchesEmpty")}
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {searches.map((search) => (
            <li key={search.id}>
              <Link
                href={search.href}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-amnii-cream/50"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-amnii-navy/5 text-amnii-navy">
                    <Search className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium capitalize text-amnii-navy">
                      {search.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatWhen(search.createdAt, locale)}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-amnii-gold-dark">
                  {t("searchAgain")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
