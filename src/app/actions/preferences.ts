"use server";

import { createClient } from "@/lib/supabase/server";

export interface UserPreferencesInput {
  preferredListingType?: "rent" | "sale" | "both" | null;
  preferredDistricts?: string[];
  preferredPropertyTypes?: string[];
  maxBudget?: number | null;
  alertsEnabled?: boolean;
}

export async function getUserPreferences() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data;
}

export async function saveUserPreferences(input: UserPreferencesInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      preferred_listing_type: input.preferredListingType ?? null,
      preferred_districts: input.preferredDistricts ?? [],
      preferred_property_types: input.preferredPropertyTypes ?? [],
      max_budget: input.maxBudget ?? null,
      alerts_enabled: input.alertsEnabled ?? false,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { error: error.message };
  return { success: true };
}
