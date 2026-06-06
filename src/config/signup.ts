import { getDistrictSelectOptions, RWANDA_DISTRICTS } from "@/config/districts";

export const REFERRAL_SOURCES = [
  "friend",
  "google",
  "social_media",
  "whatsapp",
  "agent_owner",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const SIGNUP_DISTRICTS = RWANDA_DISTRICTS.map((d) => d.name);

export const SIGNUP_DISTRICT_OPTIONS = getDistrictSelectOptions();

export const LOOKING_FOR_OPTIONS = ["rent", "buy", "both"] as const;

export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number];
