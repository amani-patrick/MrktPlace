"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFavoriteListingIds,
  toggleFavorite,
} from "@/app/actions/favorites";

export const FAVORITES_QUERY_KEY = ["favorites"] as const;

export function useFavoriteIds(initialIds: string[] = []) {
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: getFavoriteListingIds,
    initialData: initialIds,
    staleTime: 30_000,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (listingId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previous = queryClient.getQueryData<string[]>(FAVORITES_QUERY_KEY) ?? [];
      const isSaved = previous.includes(listingId);
      queryClient.setQueryData(
        FAVORITES_QUERY_KEY,
        isSaved
          ? previous.filter((id) => id !== listingId)
          : [...previous, listingId],
      );
      return { previous };
    },
    onError: (_err, _listingId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}

export function useIsFavorite(listingId: string, initialIds: string[] = []) {
  const { data: ids = initialIds } = useFavoriteIds(initialIds);
  return ids.includes(listingId);
}
