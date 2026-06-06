"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFavoritesContext } from "@/providers/favorites-provider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ listingId, className, size = "md" }: FavoriteButtonProps) {
  const t = useTranslations("favorites");
  const { isFavorite, toggle } = useFavoritesContext();
  const saved = isFavorite(listingId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors",
        size === "sm" ? "size-8" : "size-10",
        saved
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-white/90 text-muted-foreground shadow-sm hover:bg-white hover:text-red-500",
        className,
      )}
      aria-label={saved ? t("remove") : t("save")}
      aria-pressed={saved}
    >
      <Heart className={cn(size === "sm" ? "size-4" : "size-5", saved && "fill-current")} />
    </button>
  );
}
