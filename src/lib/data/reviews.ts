import { createClient } from "@/lib/supabase/server";

export interface AgentReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName: string | null;
}

export async function getAgentReviews(agentId: string): Promise<AgentReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("agent_reviews")
    .select("id, rating, comment, created_at, profiles ( full_name )")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  return data.map((row) => {
    const profiles = row.profiles as
      | { full_name: string | null }
      | { full_name: string | null }[]
      | null;
    const name = Array.isArray(profiles)
      ? profiles[0]?.full_name
      : profiles?.full_name;

    return {
      id: row.id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      reviewerName: name ?? null,
    };
  });
}
