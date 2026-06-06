import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Listing } from "@/types";
import { AmniiListingCard } from "./listing-card";

interface UrgentListingsProps {
  listings: Listing[];
}

export function UrgentListings({ listings }: UrgentListingsProps) {
  return (
    <section className="bg-white py-14 lg:py-16" aria-labelledby="urgent-listings">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
              Act fast
            </p>
            <h2
              id="urgent-listings"
              className="mt-1 font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl"
            >
              Urgent Rentals
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Properties that need tenants soon — contact owners directly today
            </p>
          </div>
          <Link
            href="/search?type=rent&featured=true"
            className="hidden items-center gap-1 text-sm font-semibold text-amnii-gold-dark hover:text-amnii-navy sm:inline-flex"
          >
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <AmniiListingCard
              key={listing.id}
              listing={listing}
              variant="urgent"
              badge={i === 0 ? "Urgent" : i === 1 ? "New" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
