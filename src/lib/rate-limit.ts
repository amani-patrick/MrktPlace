import type { SupabaseClient } from "@supabase/supabase-js";

export const RATE_LIMITS = {
  agent_review: { max: 5, windowMinutes: 24 * 60 },
  agent_report: { max: 10, windowMinutes: 24 * 60 },
  listing_report: { max: 10, windowMinutes: 24 * 60 },
  feedback: { max: 3, windowMinutes: 24 * 60 },
  create_listing: { max: 10, windowMinutes: 24 * 60 },
  listing_status_update: { max: 30, windowMinutes: 24 * 60 },
  listing_description_update: { max: 40, windowMinutes: 24 * 60 },
  listing_delete: { max: 10, windowMinutes: 24 * 60 },
  favorite_toggle: { max: 60, windowMinutes: 60 },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMITS;

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  action: RateLimitAction,
): Promise<{ allowed: boolean; retryAfterMinutes?: number }> {
  const { max, windowMinutes } = RATE_LIMITS[action];
  const since = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("action_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("action_type", action)
    .gte("created_at", since);

  if (error) {
    return { allowed: true };
  }

  if ((count ?? 0) >= max) {
    return { allowed: false, retryAfterMinutes: windowMinutes };
  }

  return { allowed: true };
}

export async function logAction(
  supabase: SupabaseClient,
  userId: string,
  action: RateLimitAction,
) {
  await supabase.from("action_logs").insert({
    user_id: userId,
    action_type: action,
  });
}
