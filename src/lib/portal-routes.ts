import type { UserRole } from "@/types";

/** Default portal dashboard for a user's primary role. */
export function getDashboardHref(role: UserRole | null | undefined): string {
  switch (role) {
    case "admin":
      return "/portal/admin";
    case "agent":
      return "/portal/agent";
    case "owner":
      return "/portal/owner";
    default:
      return "/portal/seeker";
  }
}

/** Listings management path when the role has a listings workspace. */
export function getListingsHref(role: UserRole | null | undefined): string | null {
  if (role === "owner") return "/portal/owner/listings";
  if (role === "agent") return "/portal/agent/listings";
  return null;
}
