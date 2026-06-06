"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AgentOnboardingInput {
  agency: string;
  district: string;
  servesIn: string[];
  languages: string[];
  bio: string;
  licenseNumber: string;
  licenseDocUrl: string;
  idDocUrl: string;
  yearsExperience: number;
  whatsapp: string;
}

export async function getAgentOnboardingStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("agent_profiles")
    .select(
      "id, agency, district, serves_in, languages, bio, license_number, license_doc_url, id_doc_url, years_experience, whatsapp, onboarding_status, rejection_reason, is_verified",
    )
    .eq("profile_id", user.id)
    .maybeSingle();

  return data;
}

export async function submitAgentOnboarding(input: AgentOnboardingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "agent") {
    return { error: "Only agent accounts can submit onboarding" };
  }

  const { error } = await supabase
    .from("agent_profiles")
    .update({
      agency: input.agency.trim(),
      district: input.district.trim(),
      serves_in: input.servesIn,
      languages: input.languages,
      bio: input.bio.trim(),
      license_number: input.licenseNumber.trim(),
      license_doc_url: input.licenseDocUrl.trim(),
      id_doc_url: input.idDocUrl.trim(),
      years_experience: input.yearsExperience,
      whatsapp: input.whatsapp.trim(),
      onboarding_status: "submitted",
      rejection_reason: null,
    })
    .eq("profile_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/portal/agent/onboarding");
  revalidatePath("/portal/admin/agents");
  return { success: true };
}

export async function approveAgent(agentProfileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const { data: admin } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (admin?.role !== "admin") return { error: "Not authorized" };

  const { error } = await supabase
    .from("agent_profiles")
    .update({
      onboarding_status: "approved",
      is_verified: true,
      rejection_reason: null,
    })
    .eq("id", agentProfileId);

  if (error) return { error: error.message };

  revalidatePath("/portal/admin/agents");
  revalidatePath("/agents");
  return { success: true };
}

export async function rejectAgent(agentProfileId: string, reason: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const { data: admin } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (admin?.role !== "admin") return { error: "Not authorized" };

  const { error } = await supabase
    .from("agent_profiles")
    .update({
      onboarding_status: "rejected",
      is_verified: false,
      rejection_reason: reason.trim(),
    })
    .eq("id", agentProfileId);

  if (error) return { error: error.message };

  revalidatePath("/portal/admin/agents");
  return { success: true };
}
