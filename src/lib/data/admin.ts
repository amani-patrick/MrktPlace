import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  pendingListings: number;
  openReports: number;
  openAgentReports: number;
  flaggedUsers: number;
  verificationRequests: number;
}

export interface AdminReportRow {
  id: string;
  listingId: string;
  listingTitle: string;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
}

export interface AdminUserRow {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string;
  reportCount: number;
  listingCount: number;
  isSuspended: boolean;
}

export interface AdminListingRow {
  id: string;
  title: string;
  district: string;
  sector: string;
  status: string;
  verificationStatus: string;
  createdAt: string;
}

export interface AdminAgentReportRow {
  id: string;
  agentId: string;
  agentName: string;
  agency: string | null;
  reason: string;
  details: string | null;
  status: string;
  createdAt: string;
}

export interface SignupInsightRow {
  userId: string;
  fullName: string | null;
  email: string | null;
  accountType: string;
  referralSource: string;
  referralSourceOther: string | null;
  primaryDistrict: string;
  lookingFor: string | null;
  createdAt: string;
}

export interface SignupAnalytics {
  total: number;
  byReferral: { label: string; count: number }[];
  byAccountType: { label: string; count: number }[];
  byDistrict: { label: string; count: number }[];
  recent: SignupInsightRow[];
}

export interface AdminFeedbackRow {
  id: string;
  userEmail: string | null;
  rating: number | null;
  comment: string | null;
  triggerType: string;
  pagePath: string | null;
  createdAt: string;
}

async function getSupabase() {
  return createClient();
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await getSupabase();

  const [pending, verification, reports, agentReports, flagged] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("agent_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_suspended", true),
  ]);

  return {
    pendingListings: pending.count ?? 0,
    openReports: reports.count ?? 0,
    openAgentReports: agentReports.count ?? 0,
    flaggedUsers: flagged.count ?? 0,
    verificationRequests: verification.count ?? 0,
  };
}

export async function getAdminListingsForReview(): Promise<AdminListingRow[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, district, sector, status, verification_status, created_at")
    .or("status.eq.pending,verification_status.eq.pending")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    district: row.district,
    sector: row.sector,
    status: row.status,
    verificationStatus: row.verification_status,
    createdAt: row.created_at,
  }));
}

export async function getAdminReports(): Promise<AdminReportRow[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, listing_id, reason, details, status, created_at, listings ( title )",
    )
    .in("status", ["open", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row) => {
    const listing = row.listings as { title: string } | { title: string }[] | null;
    const title = Array.isArray(listing)
      ? listing[0]?.title
      : listing?.title;

    return {
      id: row.id,
      listingId: row.listing_id,
      listingTitle: title ?? "Unknown listing",
      reason: row.reason,
      details: row.details,
      status: row.status,
      createdAt: row.created_at,
    };
  });
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = await getSupabase();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, is_suspended")
    .neq("role", "admin")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !profiles) return [];

  const rows: AdminUserRow[] = [];

  for (const profile of profiles) {
    const [reports, listings] = await Promise.all([
      supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("reporter_id", profile.id),
      supabase
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", profile.id),
    ]);

    rows.push({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      role: profile.role,
      reportCount: reports.count ?? 0,
      listingCount: listings.count ?? 0,
      isSuspended: profile.is_suspended ?? false,
    });
  }

  return rows;
}

export async function getAdminAgentReports(): Promise<AdminAgentReportRow[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("agent_reports")
    .select(
      "id, agent_id, reason, details, status, created_at, agent_profiles ( agency, profiles ( full_name, email ) )",
    )
    .in("status", ["open", "reviewing"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row) => {
    const agent = row.agent_profiles as
      | {
          agency: string | null;
          profiles: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
        }
      | {
          agency: string | null;
          profiles: { full_name: string | null; email: string | null } | { full_name: string | null; email: string | null }[] | null;
        }[]
      | null;
    const agentProfile = Array.isArray(agent) ? agent[0] : agent;
    const profiles = agentProfile?.profiles;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;
    const agentName = profile?.full_name ?? profile?.email ?? "Unknown agent";

    return {
      id: row.id,
      agentId: row.agent_id,
      agentName,
      agency: agentProfile?.agency ?? null,
      reason: row.reason,
      details: row.details,
      status: row.status,
      createdAt: row.created_at,
    };
  });
}

export async function getAdminFeedback(): Promise<AdminFeedbackRow[]> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("feedback_submissions")
    .select("id, rating, comment, trigger_type, page_path, created_at, profiles ( email )")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data) return [];

  return data.map((row) => {
    const profiles = row.profiles as { email: string | null } | { email: string | null }[] | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;

    return {
      id: row.id,
      userEmail: profile?.email ?? null,
      rating: row.rating,
      comment: row.comment,
      triggerType: row.trigger_type,
      pagePath: row.page_path,
      createdAt: row.created_at,
    };
  });
}

function countByField<T extends string>(
  rows: T[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const value of rows) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getSignupAnalytics(): Promise<SignupAnalytics> {
  const supabase = await getSupabase();

  const { data, error } = await supabase
    .from("signup_surveys")
    .select(
      "user_id, account_type, referral_source, referral_source_other, primary_district, looking_for, created_at, profiles ( full_name, email )",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) {
    return {
      total: 0,
      byReferral: [],
      byAccountType: [],
      byDistrict: [],
      recent: [],
    };
  }

  const recent: SignupInsightRow[] = data.map((row) => {
    const profiles = row.profiles as
      | { full_name: string | null; email: string | null }
      | { full_name: string | null; email: string | null }[]
      | null;
    const profile = Array.isArray(profiles) ? profiles[0] : profiles;

    return {
      userId: row.user_id,
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? null,
      accountType: row.account_type,
      referralSource: row.referral_source,
      referralSourceOther: row.referral_source_other,
      primaryDistrict: row.primary_district,
      lookingFor: row.looking_for,
      createdAt: row.created_at,
    };
  });

  return {
    total: data.length,
    byReferral: countByField(data.map((r) => r.referral_source)),
    byAccountType: countByField(data.map((r) => r.account_type)),
    byDistrict: countByField(data.map((r) => r.primary_district)).slice(0, 8),
    recent: recent.slice(0, 20),
  };
}
