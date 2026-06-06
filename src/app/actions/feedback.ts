"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, logAction } from "@/lib/rate-limit";

export async function submitFeedback(input: {
  rating: number;
  comment?: string;
  triggerType: string;
  pagePath?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "auth_required" as const };

  const limit = await checkRateLimit(supabase, user.id, "feedback");
  if (!limit.allowed) return { error: "rate_limited" as const };

  const { error } = await supabase.from("feedback_submissions").insert({
    user_id: user.id,
    rating: input.rating,
    comment: input.comment?.trim() ?? null,
    trigger_type: input.triggerType,
    page_path: input.pagePath ?? null,
  });

  if (error) return { error: error.message };

  await logAction(supabase, user.id, "feedback");
  return { success: true };
}
