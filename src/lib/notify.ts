import type { useTranslations } from "next-intl";

type Translate = ReturnType<typeof useTranslations<"notifications">>;

const ERROR_KEYS: Record<string, string> = {
  auth_required: "authRequired",
  rate_limited: "rateLimited",
  self_review: "selfReview",
  self_report: "selfReport",
  already_reviewed: "alreadyReviewed",
  suspended: "suspended",
  invalid_rating: "invalidRating",
  contact_required: "contactRequired",
  ownership_required: "ownershipRequired",
  not_authorized: "notAuthorized",
  listing_not_found: "listingNotFound",
  invalid_status_transition: "invalidStatusTransition",
  description_required: "descriptionRequired",
  description_too_long: "descriptionTooLong",
  delete_confirm_mismatch: "deleteConfirmMismatch",
};

export function friendlyError(t: Translate, code: string): string {
  const key = ERROR_KEYS[code];
  if (key) return t(key);
  return t("genericError");
}
