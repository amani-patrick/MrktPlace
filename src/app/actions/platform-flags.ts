"use server";

import { logAdminAction } from "@/lib/audit";
import { runScamDetection } from "@/lib/data/analytics";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function runScamScan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profile?.role !== "admin") return { error: "Not authorized" };

  const flagged = await runScamDetection();
  await logAdminAction("run_scam_scan", undefined, { flagged });
  revalidatePath("/portal/admin/flags");
  return { success: true, flagged };
}

export async function dismissPlatformFlag(flagId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profile?.role !== "admin") return { error: "Not authorized" };

  const { error } = await supabase
    .from("platform_flags")
    .update({ status: "dismissed" })
    .eq("id", flagId);

  if (error) return { error: error.message };

  await logAdminAction("dismiss_flag", { type: "platform_flag", id: flagId });
  revalidatePath("/portal/admin/flags");
  return { success: true };
}
