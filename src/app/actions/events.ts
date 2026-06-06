"use server";

import { createClient } from "@/lib/supabase/server";

export type ListingEventType =
  | "listing_viewed"
  | "contact_phone"
  | "contact_whatsapp"
  | "listing_shared"
  | "favorite_added"
  | "search_performed";

export async function trackEvent(
  eventType: ListingEventType,
  options?: {
    listingId?: string;
    sessionId?: string;
    metadata?: Record<string, string | number | boolean | null>;
  },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("listing_events").insert({
    event_type: eventType,
    listing_id: options?.listingId ?? null,
    user_id: user?.id ?? null,
    session_id: options?.sessionId ?? null,
    metadata: options?.metadata ?? {},
  });

  if (error) return { error: error.message };
  return { success: true };
}
