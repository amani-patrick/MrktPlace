"use client";

import { createContext, useContext } from "react";
import { useTranslations } from "next-intl";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/use-favorites";
import { friendlyError } from "@/lib/notify";
import { useToast } from "@/providers/toast-provider";

interface FavoritesContextValue {
  favoriteIds: string[];
  isAuthenticated: boolean;
  toggle: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;
  onAuthRequired: (context?: "favorite" | "review" | "report") => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({
  children,
  initialFavoriteIds,
  isAuthenticated,
  onAuthRequired,
}: {
  children: React.ReactNode;
  initialFavoriteIds: string[];
  isAuthenticated: boolean;
  onAuthRequired: (context?: "favorite" | "review" | "report") => void;
}) {
  const tNotify = useTranslations("notifications");
  const { showToast } = useToast();
  const { data: favoriteIds = initialFavoriteIds } = useFavoriteIds(initialFavoriteIds);
  const { mutate } = useToggleFavorite();

  function toggle(listingId: string) {
    if (!isAuthenticated) {
      onAuthRequired("favorite");
      return;
    }
    const wasSaved = favoriteIds.includes(listingId);
    mutate(listingId, {
      onSuccess: (result) => {
        if (result?.error) {
          showToast("error", friendlyError(tNotify, String(result.error)));
          return;
        }
        showToast(
          "success",
          result?.saved ? tNotify("savedListing") : tNotify("removedListing"),
        );
      },
    });
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        isAuthenticated,
        toggle,
        isFavorite: (id) => favoriteIds.includes(id),
        onAuthRequired,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavoritesContext must be used within FavoritesProvider");
  }
  return ctx;
}
