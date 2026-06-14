"use client";

import { useTranslations } from "next-intl";
import type { ListingStatus, ListingType } from "@/types";
import { cn } from "@/lib/utils";

interface ListingStatusBadgeProps {
  status: ListingStatus;
  listingType?: ListingType;
  className?: string;
}

export function ListingStatusBadge({
  status,
  listingType = "rent",
  className,
}: ListingStatusBadgeProps) {
  const t = useTranslations("listingManage");

  const labelKey = (() => {
    if (status === "rented") {
      return listingType === "sale" ? "statusSold" : "statusRented";
    }
    if (status === "unlisted") return "statusUnlisted";
    if (status === "active") return "statusActive";
    if (status === "pending") return "statusPending";
    if (status === "rejected") return "statusRejected";
    if (status === "paused") return "statusPaused";
    return "statusDraft";
  })();

  const tone = (() => {
    switch (status) {
      case "active":
        return "border-emerald-200 bg-emerald-50 text-emerald-900";
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-900";
      case "rented":
        return "border-sky-200 bg-sky-50 text-sky-900";
      case "unlisted":
      case "paused":
        return "border-slate-200 bg-slate-50 text-slate-700";
      case "rejected":
        return "border-red-200 bg-red-50 text-red-900";
      default:
        return "border-border bg-muted text-muted-foreground";
    }
  })();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tone,
        className,
      )}
    >
      {t(labelKey)}
    </span>
  );
}
