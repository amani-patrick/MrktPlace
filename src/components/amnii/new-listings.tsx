import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Listing } from "@/types";
import { AmniiListingCard } from "./listing-card";

interface NewListingsProps {
  listings: Listing[];
}

export function NewListings({ listings }: NewListingsProps) {

  return (
    <section className="bg-amnii-cream py-14 lg:py-16" aria-labelledby="new-listings">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
              Fresh on Amnii
            </p>
            <h2
              id="new-listings"
              className="mt-1 font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl"
            >
              Recently Added Properties
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden items-center gap-1 text-sm font-semibold text-amnii-gold-dark hover:text-amnii-navy sm:inline-flex"
          >
            Browse all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <AmniiListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
