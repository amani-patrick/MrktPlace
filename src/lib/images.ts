import type { PropertyType } from "@/types";

const PROPERTY_IMAGES: Record<PropertyType, string> = {
  apartment: "/images/placeholders/apartment.svg",
  house: "/images/placeholders/house.svg",
  room: "/images/placeholders/room.svg",
  studio: "/images/placeholders/studio.svg",
  commercial: "/images/placeholders/office.svg",
  office: "/images/placeholders/office.svg",
  land: "/images/placeholders/district.svg",
  warehouse: "/images/placeholders/office.svg",
  mixed_use: "/images/placeholders/apartment.svg",
};

export const HERO_IMAGE = "/images/placeholders/hero.svg";
export const DISTRICT_IMAGE = "/images/placeholders/district.svg";

export function getListingImage(propertyType: PropertyType, imageUrl?: string) {
  return imageUrl ?? PROPERTY_IMAGES[propertyType];
}

export function getDistrictImage(_slug: string) {
  return DISTRICT_IMAGE;
}
