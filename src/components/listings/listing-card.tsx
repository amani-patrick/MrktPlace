import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getListingImage } from "@/lib/images";
import type { Listing } from "@/types";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
  variant?: "default" | "featured";
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatListingType(type: string) {
  return type.replace(/_/g, " ");
}

export function ListingCard({ listing, variant = "default" }: ListingCardProps) {
  const isFeatured = variant === "featured";
  const imageSrc = getListingImage(listing.propertyType, listing.imageUrl);

  return (
    <Link href={`/listings/${listing.id}`} className="group block h-full">
      <Card
        className={cn(
          "h-full overflow-hidden border-border/80 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          isFeatured && "rounded-2xl",
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageSrc}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={isFeatured ? "300px" : "(max-width: 768px) 100vw, 25vw"}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="border-0 bg-white/95 capitalize text-foreground shadow-sm">
              {formatListingType(listing.listingType)}
            </Badge>
            {listing.verificationStatus === "verified" ? (
              <Badge className="gap-1 border-0 bg-accent text-accent-foreground shadow-sm">
                <ShieldCheck className="size-3" aria-hidden="true" />
                Verified
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="space-y-2 p-4">
          <p className="text-xl font-bold tracking-tight text-primary">
            {formatPrice(listing.price, listing.currency)}
            {listing.listingType === "rent" ||
            listing.listingType === "commercial_rent" ? (
              <span className="text-sm font-medium text-muted-foreground"> /mo</span>
            ) : null}
          </p>

          <h3 className="line-clamp-1 font-semibold text-foreground group-hover:text-primary">
            {listing.title}
          </h3>

          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-rw-green" aria-hidden="true" />
            {listing.sector}, {listing.district}
          </p>

          <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
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
            {listing.squareMeters ? (
              <span>{listing.squareMeters} m²</span>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
