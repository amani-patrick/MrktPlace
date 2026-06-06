"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Bath, BedDouble, MapPin, ShieldCheck } from "lucide-react";
import { getListingImage } from "@/lib/images";
import { getListingSourceLabel } from "@/lib/listing-contact";
import { formatListingType, formatPrice } from "@/lib/format";
import type { Listing } from "@/types";
import { Link } from "@/i18n/navigation";
import { FavoriteButton } from "./favorite-button";
import { cn } from "@/lib/utils";

interface AmniiListingCardProps {
  listing: Listing;
  variant?: "default" | "urgent";
  badge?: "urgent" | "new";
}

export function AmniiListingCard({
  listing,
  variant = "default",
  badge,
}: AmniiListingCardProps) {
  const t = useTranslations("listing");
  const isUrgent = variant === "urgent";
  const imageSrc = getListingImage(listing.propertyType, listing.imageUrl);

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <article
        className={cn(
          "h-full overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
          isUrgent && "rounded-3xl",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-muted",
            isUrgent ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        >
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isUrgent ? "400px" : "(max-width: 768px) 100vw, 25vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton listingId={listing.id} size="sm" />
          </div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {badge ? (
              <span className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase">
                {t(badge)}
              </span>
            ) : null}
            <span className="rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold capitalize text-amnii-navy">
              {formatListingType(listing.listingType)}
            </span>
            <span
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold",
                listing.listingSource === "agent_managed"
                  ? "bg-amnii-navy/90 text-white"
                  : "bg-white/95 text-amnii-navy",
              )}
            >
              {getListingSourceLabel(listing.listingSource, t)}
            </span>
            {listing.verificationStatus === "verified" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amnii-gold px-2.5 py-1 text-xs font-semibold text-amnii-navy">
                <ShieldCheck className="size-3" aria-hidden="true" />
                {t("verified")}
              </span>
            ) : null}
          </div>
        </div>

        <div className={cn("space-y-2", isUrgent ? "p-5" : "p-4")}>
          <p className="text-lg font-bold text-amnii-gold-dark">
            {formatPrice(listing.price, listing.currency)}
            {listing.listingType === "rent" ||
            listing.listingType === "commercial_rent" ? (
              <span className="text-sm font-medium text-muted-foreground">
                {t("perMonth")}
              </span>
            ) : null}
          </p>

          <h3
            className={cn(
              "line-clamp-1 font-semibold text-amnii-navy group-hover:text-amnii-gold-dark",
              isUrgent && "text-lg",
            )}
          >
            {listing.title}
          </h3>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-amnii-gold" aria-hidden="true" />
            {listing.sector}, {listing.district}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {listing.bedrooms !== null ? (
              <span className="inline-flex items-center gap-1">
                <BedDouble className="size-4" aria-hidden="true" />
                {listing.bedrooms}
              </span>
            ) : null}
            {listing.bathrooms !== null ? (
              <span className="inline-flex items-center gap-1">
                <Bath className="size-4" aria-hidden="true" />
                {listing.bathrooms}
              </span>
            ) : null}
            {listing.squareMeters ? <span>{listing.squareMeters} m²</span> : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
