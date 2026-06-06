import { createClient } from "@/lib/supabase/server";

export async function logAdminAction(
  action: string,
  target?: { type: string; id: string },
  details?: Record<string, unknown>,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("admin_audit_log").insert({
    admin_id: user.id,
    action,
    target_type: target?.type ?? null,
    target_id: target?.id ?? null,
    details: details ?? {},
  });
}
