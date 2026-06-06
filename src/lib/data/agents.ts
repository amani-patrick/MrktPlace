import { createClient } from "@/lib/supabase/server";
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
  rating: number | null;
  rent_count: number;
  sale_count: number;
  whatsapp: string | null;
  badges: string[];
  response_time_hours: number | null;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
}

const AVATAR_COLORS = [
  "from-amnii-navy to-amnii-navy/70",
  "from-amber-600 to-amnii-gold",
  "from-slate-700 to-slate-500",
  "from-emerald-700 to-emerald-500",
];

function formatResponseTime(hours: number | null): string {
  if (!hours) return "2h";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours}h`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function resolveProfileName(
  profiles: DbAgent["profiles"],
): string {
  if (!profiles) return "Agent";
  if (Array.isArray(profiles)) return profiles[0]?.full_name ?? "Agent";
  return profiles.full_name ?? "Agent";
}

function mapAgent(row: DbAgent, index: number): AgentProfile {
  const name = resolveProfileName(row.profiles);
  return {
    id: row.id,
    name,
    initials: getInitials(name),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    servesIn: row.serves_in ?? [],
    district: row.district ?? "gasabo",
    languages: row.languages ?? ["Kinyarwanda", "English"],
    rentCount: row.rent_count,
    saleCount: row.sale_count,
    agency: row.agency ?? "Independent Agent",
    agencyShort: row.agency_short ?? "IA",
    rating: row.rating ?? 4.5,
    responseTime: formatResponseTime(row.response_time_hours),
    phoneVerified: row.is_verified,
    badges: (row.badges ?? []) as AgentBadge[],
    whatsapp: row.whatsapp ?? "+250788000000",
  };
}

export async function getAgents(): Promise<AgentProfile[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_profiles")
      .select(
        `id, profile_id, agency, agency_short, serves_in, district, languages,
         is_verified, rating, rent_count, sale_count, whatsapp, badges,
         response_time_hours, profiles ( full_name )`,
      )
      .order("rent_count", { ascending: false });

    if (error) {
      if (error.code === "PGRST205") return mockAgents;
      return mockAgents;
    }

    if (!data?.length) return mockAgents;

    return (data as unknown as DbAgent[]).map(mapAgent);
  } catch {
    return mockAgents;
  }
}

export async function getAgentById(id: string): Promise<AgentProfile | null> {
  const agents = await getAgents();
  return agents.find((a) => a.id === id) ?? null;
}
