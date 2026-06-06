"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { contactDisplayForSource } from "@/lib/listing-contact";
import { checkRateLimit, logAction } from "@/lib/rate-limit";
import type { ContactDisplay, ListingSource, PropertyType } from "@/types";
import type { ListingType } from "@/types";

export interface CreateListingInput {
  title: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  bedrooms: number | null;
  district: string;
  sector: string;
  contactPhone: string;
  whatsappNumber?: string;
  listingSource: ListingSource;
  agentId: string | null;
  contactDisplay: ContactDisplay;
  imageUrl?: string;
  /** Required for owner-direct listings — seeker confirms they own or may list the property. */
  ownsProperty?: boolean;
}

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("250")) return `+${digits}`;
  if (digits.startsWith("0")) return `+25${digits}`;
  if (digits.length === 9) return `+250${digits}`;
  return raw.startsWith("+") ? raw : `+${digits}`;
}

export async function createListing(input: CreateListingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = await getLocale();

  if (!user) {
    return redirect({
      href: { pathname: "/login", query: { next: "/listings/new" } },
      locale,
    });
  }

  const limit = await checkRateLimit(supabase, user.id, "create_listing");
  if (!limit.allowed) {
    return { error: "rate_limited" };
  }

  if (!input.contactPhone.trim()) {
    return { error: "contact_required" };
  }

  if (input.listingSource === "agent_managed" && !input.agentId) {
    return { error: "Select an agent for agent-managed listings." };
  }

  if (input.listingSource === "owner_direct" && !input.ownsProperty) {
    return { error: "ownership_required" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const contactDisplay = contactDisplayForSource(
    input.listingSource,
    input.contactDisplay,
  );

  const phone = formatPhone(input.contactPhone);
  const whatsapp = input.whatsappNumber
    ? formatPhone(input.whatsappNumber)
    : phone;

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      owner_id: user.id,
      title: input.title.trim(),
      description: input.description.trim(),
      property_type: input.propertyType,
      listing_type: input.listingType,
      price: input.price,
      currency: "RWF",
      bedrooms: input.bedrooms,
      district: input.district,
      sector: input.sector.trim(),
      contact_phone: phone,
      whatsapp_number: whatsapp,
      listing_source: input.listingSource,
      agent_id: input.agentId,
      contact_display: contactDisplay,
      status: "pending",
      verification_status: "unverified",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (input.imageUrl) {
    await supabase.from("listing_images").insert({
      listing_id: listing.id,
      url: input.imageUrl,
      sort_order: 0,
    });
  }

  await logAction(supabase, user.id, "create_listing");

  if (profile?.role === "seeker" && input.listingSource === "owner_direct") {
    await supabase.from("profiles").update({ role: "owner" }).eq("id", user.id);
    revalidatePath("/portal/owner");
  }

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/listings/${listing.id}`);
  redirect({ href: `/listings/${listing.id}`, locale });
}
