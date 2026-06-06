"use server";

import { createClient } from "@/lib/supabase/server";

export async function recordListingView(listingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from("listing_views").insert({
    listing_id: listingId,
    viewer_id: user?.id ?? null,
  });

  await supabase.from("listing_events").insert({
    event_type: "listing_viewed",
    listing_id: listingId,
    user_id: user?.id ?? null,
  });
}
