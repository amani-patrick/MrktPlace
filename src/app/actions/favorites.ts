"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, logAction } from "@/lib/rate-limit";

export async function getFavoriteListingIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id);

  if (error || !data) return [];
  return data.map((row) => row.listing_id);
}

export async function toggleFavorite(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const { data: existing } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", listingId);

    if (error) return { error: error.message };
    await logAction(supabase, user.id, "favorite_toggle");
    revalidatePath("/portal/seeker/favorites");
    return { saved: false };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    listing_id: listingId,
  });

  if (error) return { error: error.message };

  await logAction(supabase, user.id, "favorite_toggle");
  revalidatePath("/portal/seeker/favorites");
  return { saved: true };
}
