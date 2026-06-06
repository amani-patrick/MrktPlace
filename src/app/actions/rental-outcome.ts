"use server";

import { createClient } from "@/lib/supabase/server";

export type RentalOutcome = "rented" | "still_looking" | "not_interested";

export async function submitRentalOutcome(
  listingId: string,
  agentId: string | null,
  outcome: RentalOutcome,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("rental_outcome_responses").upsert(
    {
      user_id: user.id,
      listing_id: listingId,
      agent_id: agentId,
      outcome,
    },
    { onConflict: "user_id,listing_id" },
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function getPendingRentalPrompt(userId: string) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data: contacts } = await supabase
    .from("listing_events")
    .select("listing_id, created_at, listings ( title, agent_id, listing_type )")
    .eq("user_id", userId)
    .in("event_type", ["contact_phone", "contact_whatsapp"])
    .lte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(5);

  if (!contacts?.length) return null;

  for (const c of contacts) {
    const listings = c.listings as
      | { title: string; agent_id: string | null; listing_type: string }
      | { title: string; agent_id: string | null; listing_type: string }[]
      | null;
    const listing = Array.isArray(listings) ? listings[0] : listings;
    if (!listing || listing.listing_type !== "rent") continue;

    const { data: existing } = await supabase
      .from("rental_outcome_responses")
      .select("id")
      .eq("user_id", userId)
      .eq("listing_id", c.listing_id)
      .maybeSingle();

    if (!existing) {
      return {
        listingId: c.listing_id as string,
        listingTitle: listing.title,
        agentId: listing.agent_id,
      };
    }
  }

  return null;
}
