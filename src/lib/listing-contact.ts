import type { ContactDisplay, Listing, ListingContact, ListingSource } from "@/types";

export function getListingSourceLabel(source: Listing["listingSource"]): string {
  return source === "agent_managed" ? "Agent Managed" : "Owner Direct";
}

export function resolveListingContact(listing: Listing): ListingContact {
  const owner = {
    label: "Contact owner",
    phone: listing.contactPhone,
    whatsapp: listing.whatsappNumber,
  };

  if (listing.listingSource === "owner_direct" || listing.contactDisplay === "owner") {
    return owner;
  }

  const agent = {
    label: listing.agentName ? `Contact ${listing.agentName}` : "Contact agent",
    phone: listing.agentPhone ?? listing.contactPhone,
    whatsapp: listing.agentWhatsapp ?? listing.whatsappNumber,
  };

  if (listing.contactDisplay === "both") {
    return { ...agent, secondary: owner };
  }

  return agent;
}

export function contactDisplayForSource(
  source: ListingSource,
  preference: ContactDisplay,
): ContactDisplay {
  if (source === "owner_direct") return "owner";
  return preference;
}
