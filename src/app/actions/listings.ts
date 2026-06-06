"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { contactDisplayForSource } from "@/lib/listing-contact";
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
  listingSource: ListingSource;
  agentId: string | null;
  contactDisplay: ContactDisplay;
  imageUrl?: string;
}

export async function createListing(input: CreateListingInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/listings/new");
  }

  const phone = user.phone ?? user.user_metadata?.phone;
  if (!phone) {
    return { error: "Your account must have a verified phone number." };
  }

  if (input.listingSource === "agent_managed" && !input.agentId) {
    return { error: "Select an agent for agent-managed listings." };
  }

  const contactDisplay = contactDisplayForSource(
    input.listingSource,
    input.contactDisplay,
  );

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
      whatsapp_number: phone,
      listing_source: input.listingSource,
      agent_id: input.agentId,
      contact_display: contactDisplay,
      status: "active",
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

  revalidatePath("/");
  revalidatePath("/search");
  redirect(`/listings/${listing.id}`);
}
