"use server";

import { revalidatePath } from "next/cache";
import { syncAgentProfileStats } from "@/lib/data/agent-stats";
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

  if (
    options?.listingId &&
    (eventType === "contact_phone" || eventType === "contact_whatsapp")
  ) {
    const { data: listing } = await supabase
      .from("listings")
      .select("agent_id")
      .eq("id", options.listingId)
      .maybeSingle();

    if (listing?.agent_id) {
      await syncAgentProfileStats(supabase, listing.agent_id);
      revalidatePath(`/agents/${listing.agent_id}`);
    }
  }

  return { success: true };
}
