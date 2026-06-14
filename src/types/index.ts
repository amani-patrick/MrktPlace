import type { LISTING_TYPES, PROPERTY_TYPES, USER_ROLES } from "@/config/constants";

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type ListingType = (typeof LISTING_TYPES)[number];
export type UserRole = (typeof USER_ROLES)[number];

export type ListingStatus =
  | "draft"
  | "pending"
  | "active"
  | "paused"
  | "rejected"
  | "rented"
  | "unlisted";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type ListingSource = "owner_direct" | "agent_managed";
export type ContactDisplay = "owner" | "agent" | "both";

export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  currency: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  squareMeters: number | null;
  district: string;
  sector: string;
  cell: string | null;
  latitude: number | null;
  longitude: number | null;
  contactPhone: string;
  whatsappNumber: string | null;
  features: string[];
  status: ListingStatus;
  verificationStatus: VerificationStatus;
  ownerId: string;
  listingSource: ListingSource;
  agentId: string | null;
  contactDisplay: ContactDisplay;
  agentName: string | null;
  agentPhone: string | null;
  agentWhatsapp: string | null;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingImage {
  id: string;
  listingId: string;
  url: string;
  sortOrder: number;
}

export interface Profile {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  role: UserRole;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AgentProfile {
  id: string;
  profileId: string;
  bio: string | null;
  isVerified: boolean;
  totalViews: number;
  responseTimeHours: number | null;
  rating: number | null;
}

export interface ListingContact {
  label: string;
  phone: string;
  whatsapp: string | null;
  secondary?: { label: string; phone: string; whatsapp: string | null };
}
