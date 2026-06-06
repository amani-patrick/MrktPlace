import { createClient } from "@/lib/supabase/server";
import { mockListings } from "@/lib/mock-listings";
import type {
  ContactDisplay,
  Listing,
  ListingSource,
  ListingStatus,
  PropertyType,
  VerificationStatus,
} from "@/types";
import type { ListingType } from "@/types";

interface DbAgentJoin {
  id: string;
  whatsapp: string | null;
  profiles: { full_name: string | null; phone: string | null } | { full_name: string | null; phone: string | null }[] | null;
}

interface DbListing {
  id: string;
  owner_id: string | null;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_type: ListingType;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking_spaces: number | null;
  square_meters: number | null;
  district: string;
  sector: string;
  cell: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_phone: string;
  whatsapp_number: string | null;
  features: string[];
  status: ListingStatus;
  verification_status: VerificationStatus;
  listing_source: ListingSource;
  agent_id: string | null;
  contact_display: ContactDisplay;
  created_at: string;
  updated_at: string;
  listing_images?: { url: string; sort_order: number }[];
  agent_profiles?: DbAgentJoin | DbAgentJoin[] | null;
}

function resolveAgent(agent: DbListing["agent_profiles"]) {
  if (!agent) return { name: null, phone: null, whatsapp: null };
  const row = Array.isArray(agent) ? agent[0] : agent;
  if (!row) return { name: null, phone: null, whatsapp: null };
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    name: profile?.full_name ?? null,
    phone: profile?.phone ?? row.whatsapp,
    whatsapp: row.whatsapp,
  };
}

function mapListing(row: DbListing): Listing {
  const sortedImages = [...(row.listing_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const agent = resolveAgent(row.agent_profiles);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    propertyType: row.property_type,
    listingType: row.listing_type,
    price: Number(row.price),
    currency: row.currency,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    parkingSpaces: row.parking_spaces,
    squareMeters: row.square_meters ? Number(row.square_meters) : null,
    district: row.district,
    sector: row.sector,
    cell: row.cell,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    contactPhone: row.contact_phone,
    whatsappNumber: row.whatsapp_number,
    features: row.features ?? [],
    status: row.status,
    verificationStatus: row.verification_status,
    ownerId: row.owner_id ?? "",
    listingSource: row.listing_source ?? "owner_direct",
    agentId: row.agent_id,
    contactDisplay: row.contact_display ?? "owner",
    agentName: agent.name,
    agentPhone: agent.phone,
    agentWhatsapp: agent.whatsapp,
    imageUrl: sortedImages[0]?.url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const listingSelect = `
  id, owner_id, title, description, property_type, listing_type,
  price, currency, bedrooms, bathrooms, parking_spaces, square_meters,
  district, sector, cell, latitude, longitude,
  contact_phone, whatsapp_number, features, status, verification_status,
  listing_source, agent_id, contact_display,
  created_at, updated_at,
  listing_images ( url, sort_order ),
  agent_profiles ( id, whatsapp, profiles ( full_name, phone ) )
`;

export async function getListings(options?: {
  limit?: number;
  verifiedOnly?: boolean;
  listingType?: string;
  district?: string;
  propertyType?: string;
  q?: string;
}): Promise<Listing[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("listings")
      .select(listingSelect)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (options?.verifiedOnly) {
      query = query.eq("verification_status", "verified");
    }
    if (options?.listingType) {
      query = query.eq("listing_type", options.listingType);
    }
    if (options?.district) {
      query = query.ilike("district", `%${options.district}%`);
    }
    if (options?.propertyType) {
      query = query.eq("property_type", options.propertyType);
    }
    if (options?.q) {
      query = query.or(
        `title.ilike.%${options.q}%,sector.ilike.%${options.q}%,district.ilike.%${options.q}%`,
      );
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST205") return mockListings;
      console.error("getListings:", error.message);
      return mockListings;
    }

    if (!data?.length) return mockListings;

    return (data as unknown as DbListing[]).map(mapListing);
  } catch {
    return mockListings;
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(listingSelect)
      .eq("id", id)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) {
      return mockListings.find((l) => l.id === id) ?? null;
    }

    return mapListing(data as unknown as DbListing);
  } catch {
    return mockListings.find((l) => l.id === id) ?? null;
  }
}

export async function getListingImages(id: string): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("listing_images")
      .select("url, sort_order")
      .eq("listing_id", id)
      .order("sort_order");

    if (error || !data?.length) return [];
    return data.map((img) => img.url);
  } catch {
    return [];
  }
}

export interface AgentOption {
  id: string;
  name: string;
  agency: string | null;
}

export async function getAgentOptions(): Promise<AgentOption[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("agent_profiles")
      .select("id, agency, profiles ( full_name )")
      .eq("is_verified", true)
      .order("rent_count", { ascending: false });

    if (error || !data?.length) return [];

    return data.map((row) => {
      const profiles = row.profiles as { full_name: string | null } | { full_name: string | null }[] | null;
      const name = Array.isArray(profiles)
        ? profiles[0]?.full_name
        : profiles?.full_name;
      return {
        id: row.id as string,
        name: name ?? "Agent",
        agency: row.agency as string | null,
      };
    });
  } catch {
    return [];
  }
}
