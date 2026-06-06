"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, logAction } from "@/lib/rate-limit";

export async function reportListing(input: {
  listingId: string;
  reason: string;
  details?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const limit = await checkRateLimit(supabase, user.id, "listing_report");
  if (!limit.allowed) {
    return { error: "rate_limited" as const };
  }

  const { error } = await supabase.from("reports").insert({
    listing_id: input.listingId,
    reporter_id: user.id,
    reason: input.reason.trim(),
    details: input.details?.trim() ?? null,
    status: "open",
  });

  if (error) return { error: error.message };

  await logAction(supabase, user.id, "listing_report");
  revalidatePath("/portal/admin/reports");
  return { success: true };
}
