import { createClient } from "@/lib/supabase/server";
import {
  computeAgentStatsBatch,
  formatResponseTime,
  type AgentComputedStats,
} from "@/lib/data/agent-stats";
import { mockAgents } from "@/lib/mock-agents";
import type { AgentBadge, AgentProfile } from "@/types/agent";

interface DbAgent {
  id: string;
  profile_id: string;
  agency: string | null;
  agency_short: string | null;
  serves_in: string[];
  district: string | null;
  languages: string[];
  is_verified: boolean;
  whatsapp: string | null;
  badges: string[];
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
}

const AVATAR_COLORS = [
  "from-amnii-navy to-amnii-navy/70",
  "from-amber-600 to-amnii-gold",
  "from-slate-700 to-slate-500",
  "from-emerald-700 to-emerald-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resolveProfileName(profiles: DbAgent["profiles"]): string {
  if (!profiles) return "Agent";
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? "Agent";
  return profiles.full_name ?? "Agent";
}

function emptyComputed(): AgentComputedStats {
  return {
    rentCount: 0,
    saleCount: 0,
    rating: null,
    reviewCount: 0,
    responseTimeHours: null,
  };
}

function mapAgent(
  row: DbAgent,
  index: number,
  computed: AgentComputedStats,
): AgentProfile {
  const name = resolveProfileName(row.profiles);
  return {
    id: row.id,
    name,
    initials: getInitials(name),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    servesIn: row.serves_in ?? [],
    district: row.district ?? "gasabo",
    languages: row.languages ?? ["Kinyarwanda", "English"],
    rentCount: computed.rentCount,
    saleCount: computed.saleCount,
    reviewCount: computed.reviewCount,
    agency: row.agency ?? "Independent Agent",
    agencyShort: row.agency_short ?? "IA",
    rating: computed.rating,
    responseTime: formatResponseTime(computed.responseTimeHours),
    phoneVerified: row.is_verified,
    badges: (row.badges ?? []) as AgentBadge[],
    whatsapp: row.whatsapp ?? "+250788000000",
  };
}

const agentSelect = `id, profile_id, agency, agency_short, serves_in, district, languages,
  is_verified, whatsapp, badges, profiles ( full_name )`;

export async function getAgents(): Promise<AgentProfile[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_profiles")
      .select(agentSelect)
      .eq("onboarding_status", "approved");

    if (error) {
      if (error.code === "PGRST205" || error.code === "42703") return mockAgents;
      return mockAgents;
    }

    if (!data?.length) return mockAgents;

    const rows = data as unknown as DbAgent[];
    const stats = await computeAgentStatsBatch(
      supabase,
      rows.map((row) => row.id),
    );

    return rows
      .map((row, index) => mapAgent(row, index, stats.get(row.id) ?? emptyComputed()))
      .sort((a, b) => b.rentCount + b.saleCount - (a.rentCount + a.saleCount));
  } catch {
    return mockAgents;
  }
}

export async function getAgentById(id: string): Promise<AgentProfile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_profiles")
      .select(agentSelect)
      .eq("id", id)
      .eq("onboarding_status", "approved")
      .maybeSingle();

    if (error || !data) {
      return mockAgents.find((a) => a.id === id) ?? null;
    }

    const stats = await computeAgentStatsBatch(supabase, [id]);
    return mapAgent(data as unknown as DbAgent, 0, stats.get(id) ?? emptyComputed());
  } catch {
    return mockAgents.find((a) => a.id === id) ?? null;
  }
}
