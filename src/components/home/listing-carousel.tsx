import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ListingCard } from "@/components/listings/listing-card";
import type { Listing } from "@/types";

interface ListingCarouselProps {
  listings: Listing[];
  title: string;
  description?: string;
  href?: string;
}

export function ListingCarousel({
  listings,
  title,
  description,
  href,
}: ListingCarouselProps) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            See all
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-thin sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {listings.map((listing) => (
          <div key={listing.id} className="w-[280px] shrink-0 sm:w-[300px]">
            <ListingCard listing={listing} variant="featured" />
          </div>
        ))}
      </div>
    </section>
  );
}
