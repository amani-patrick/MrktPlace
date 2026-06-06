import type { ContactDisplay, Listing, ListingContact, ListingSource } from "@/types";

export function getListingSourceLabel(
  source: Listing["listingSource"],
  t?: (key: string) => string,
): string {
  if (t) {
    return source === "agent_managed" ? t("agentManaged") : t("ownerDirect");
  }
  return source === "agent_managed" ? "Agent Managed" : "Owner Direct";
}

export function resolveListingContact(
  listing: Listing,
  t?: (key: string, values?: Record<string, string>) => string,
): ListingContact {
  const owner = {
    label: t ? t("contactOwner") : "Contact owner",
    phone: listing.contactPhone,
    whatsapp: listing.whatsappNumber,
  };

  if (listing.listingSource === "owner_direct" || listing.contactDisplay === "owner") {
    return owner;
  }

  const agent = {
    label: listing.agentName
      ? t
        ? t("contactAgent")
        : `Contact ${listing.agentName}`
      : t
        ? t("contactAgent")
        : "Contact agent",
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
