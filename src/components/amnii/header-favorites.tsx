"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFavoritesContext } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

export function HeaderFavorites() {
  const t = useTranslations("favorites");
  const { favoriteIds, isAuthenticated, onAuthRequired } = useFavoritesContext();

  if (isAuthenticated) {
    return (
      <Link
        href="/portal/seeker/favorites"
        className="relative hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
        aria-label={t("savedCount", { count: favoriteIds.length })}
      >
        <Heart className={cn("size-5", favoriteIds.length > 0 && "fill-red-400 text-red-400")} />
        {favoriteIds.length > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-amnii-gold text-[10px] font-bold text-amnii-navy">
            {favoriteIds.length > 9 ? "9+" : favoriteIds.length}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAuthRequired("favorite")}
      className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
      aria-label={t("savePrompt")}
    >
      <Heart className="size-5" />
    </button>
  );
}
