#!/usr/bin/env node
/**
 * Seed listings and agents via Supabase service role.
 * Run after apply-schema.mjs: npm run db:seed
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  return Object.fromEntries(
    fs
      .readFileSync(envPath, "utf8")
      .split("\n")
      .filter((l) => l && !l.startsWith("#"))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1)];
      }),
  );
}

const env = loadEnv();
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const LISTINGS = [
  {
    id: "a1000000-0000-0000-0000-000000000001",
    title: "Modern Villa in Kacyiru",
    description:
      "Executive 4-bedroom villa with garden, security, and parking near Amahoro Stadium.",
    property_type: "house",
    listing_type: "rent",
    price: 2500000,
    bedrooms: 4,
    bathrooms: 3,
    parking_spaces: 2,
    square_meters: 320,
    district: "Gasabo",
    sector: "Kacyiru",
    contact_phone: "+250788100001",
    whatsapp_number: "+250788100001",
    features: ["garden", "security", "parking"],
    verification_status: "verified",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  },
  {
    id: "a1000000-0000-0000-0000-000000000002",
    title: "Luxury Apartment Remera",
    description:
      "Bright 2BR apartment with balcony, 24/7 security, near Amahoro Stadium.",
    property_type: "apartment",
    listing_type: "rent",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    parking_spaces: 1,
    square_meters: 95,
    district: "Gasabo",
    sector: "Remera",
    contact_phone: "+250788100002",
    whatsapp_number: "+250788100002",
    features: ["security", "parking", "balcony"],
    verification_status: "verified",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  },
  {
    id: "a1000000-0000-0000-0000-000000000003",
    title: "Family House Niboye",
    description:
      "Spacious 4-bedroom house with garden in quiet Kicukiro neighborhood.",
    property_type: "house",
    listing_type: "sale",
    price: 185000000,
    bedrooms: 4,
    bathrooms: 3,
    parking_spaces: 2,
    square_meters: 220,
    district: "Kicukiro",
    sector: "Niboye",
    contact_phone: "+250788100003",
    features: ["garden", "parking"],
    verification_status: "verified",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  },
  {
    id: "a1000000-0000-0000-0000-000000000004",
    title: "Kacyiru Studio",
    description: "Compact furnished studio ideal for professionals.",
    property_type: "studio",
    listing_type: "rent",
    price: 300000,
    bedrooms: 1,
    bathrooms: 1,
    square_meters: 42,
    district: "Gasabo",
    sector: "Kacyiru",
    contact_phone: "+250788100004",
    whatsapp_number: "+250788100004",
    features: ["furnished", "wifi"],
    verification_status: "unverified",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  },
  {
    id: "a1000000-0000-0000-0000-000000000005",
    title: "Office Nyamirambo",
    description: "Central business district office with meeting room access.",
    property_type: "office",
    listing_type: "commercial_rent",
    price: 1200000,
    bathrooms: 2,
    parking_spaces: 3,
    square_meters: 150,
    district: "Nyarugenge",
    sector: "Nyamirambo",
    contact_phone: "+250788100005",
    whatsapp_number: "+250788100005",
    features: ["elevator", "security"],
    verification_status: "verified",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "a1000000-0000-0000-0000-000000000006",
    title: "Kimironko Room",
    description: "Affordable single room with shared kitchen, close to market.",
    property_type: "room",
    listing_type: "rent",
    price: 120000,
    bedrooms: 1,
    bathrooms: 1,
    square_meters: 18,
    district: "Gasabo",
    sector: "Kimironko",
    contact_phone: "+250788100006",
    whatsapp_number: "+250788100006",
    features: ["water", "electricity"],
    verification_status: "unverified",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
];

const AGENTS = [
  {
    email: "jeanpaul@amnii.seed",
    name: "Jean-Paul Nkurunziza",
    agency: "Kigali Prime Realty",
    agency_short: "KPR",
    serves_in: ["Remera", "Kimironko", "Kacyiru"],
    district: "gasabo",
    languages: ["Kinyarwanda", "English", "French"],
    rent_count: 18,
    sale_count: 6,
    rating: 4.9,
    response_time_hours: 1,
    whatsapp: "+250788100001",
    badges: ["trusted_commissioner", "quick_responder"],
  },
  {
    email: "marie@amnii.seed",
    name: "Marie Claire Uwase",
    agency: "Green Hills Properties",
    agency_short: "GHP",
    serves_in: ["Niboye", "Gatenga", "Kagarama"],
    district: "kicukiro",
    languages: ["Kinyarwanda", "English"],
    rent_count: 14,
    sale_count: 3,
    rating: 4.7,
    response_time_hours: 2,
    whatsapp: "+250788100002",
    badges: ["trusted_commissioner", "quality_lister"],
  },
];

async function ensureAgent(agent) {
  const { data: existing } = await supabase.auth.admin.listUsers();
  let user = existing?.users?.find((u) => u.email === agent.email);

  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: agent.email,
      password: "AmniiSeed2026!",
      email_confirm: true,
      user_metadata: { full_name: agent.name, role: "agent" },
    });
    if (error) throw new Error(`createUser ${agent.email}: ${error.message}`);
    user = data.user;
  }

  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: agent.name,
    email: agent.email,
    role: "agent",
  });

  const { data: profile } = await supabase
    .from("agent_profiles")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const agentRow = {
    profile_id: user.id,
    agency: agent.agency,
    agency_short: agent.agency_short,
    serves_in: agent.serves_in,
    district: agent.district,
    languages: agent.languages,
    is_verified: true,
    rent_count: agent.rent_count,
    sale_count: agent.sale_count,
    rating: agent.rating,
    response_time_hours: agent.response_time_hours,
    whatsapp: agent.whatsapp,
    badges: agent.badges,
  };

  if (profile) {
    await supabase.from("agent_profiles").update(agentRow).eq("id", profile.id);
    return profile.id;
  }

  const { data: created, error } = await supabase
    .from("agent_profiles")
    .insert(agentRow)
    .select("id")
    .single();

  if (error) throw new Error(`agent_profiles: ${error.message}`);
  return created.id;
}

async function seedListings(agentIds) {
  for (let i = 0; i < LISTINGS.length; i++) {
    const listing = LISTINGS[i];
    const { image, ...row } = listing;
    const listing_source = i === 1 ? "agent_managed" : "owner_direct";
    const agent_id = listing_source === "agent_managed" ? agentIds[0] : null;

    const payload = {
      ...row,
      currency: "RWF",
      status: "active",
    };

    if (agentIds.length) {
      Object.assign(payload, {
        listing_source,
        agent_id,
        contact_display: listing_source === "agent_managed" ? "agent" : "owner",
      });
    }

    const { error } = await supabase.from("listings").upsert(payload);
    if (error) throw new Error(`listings ${listing.title}: ${error.message}`);

    await supabase.from("listing_images").delete().eq("listing_id", listing.id);
    await supabase.from("listing_images").insert({
      listing_id: listing.id,
      url: image,
      sort_order: 0,
    });
  }
}

async function main() {
  console.log("Checking database...");
  const { error: check } = await supabase.from("listings").select("id").limit(1);
  if (check?.code === "PGRST205") {
    console.error("Tables not found. Run: npm run db:migrate");
    process.exit(1);
  }

  console.log("Seeding agents...");
  const agentIds = [];
  for (const agent of AGENTS) {
    const id = await ensureAgent(agent);
    agentIds.push(id);
    console.log(`  ✓ ${agent.name} (${id})`);
  }

  console.log("Seeding listings...");
  await seedListings(agentIds);
  console.log(`  ✓ ${LISTINGS.length} listings`);

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
