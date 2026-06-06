export const REFERRAL_SOURCES = [
  "friend",
  "google",
  "social_media",
  "whatsapp",
  "agent_owner",
  "other",
] as const;

export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const SIGNUP_DISTRICTS = [
  "Gasabo",
  "Kicukiro",
  "Nyarugenge",
  "Remera",
  "Kimironko",
  "Musanze",
  "Outside Kigali",
  "Other",
] as const;

export const LOOKING_FOR_OPTIONS = ["rent", "buy", "both"] as const;

export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number];
