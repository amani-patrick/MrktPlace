import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Listing } from "@/types";
import { Link } from "@/i18n/navigation";
import { AmniiListingCard } from "./listing-card";

interface UrgentListingsProps {
  listings: Listing[];
}

export async function UrgentListings({ listings }: UrgentListingsProps) {
  const t = await getTranslations("home");

  return (
    <section className="bg-white py-14 lg:py-16" aria-labelledby="urgent-listings">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
              {t("urgentLabel")}
            </p>
            <h2
              id="urgent-listings"
              className="mt-1 font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl"
            >
              {t("urgentTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {t("urgentDesc")}
            </p>
          </div>
          <Link
            href="/search?type=rent&featured=true"
            className="hidden items-center gap-1 text-sm font-semibold text-amnii-gold-dark hover:text-amnii-navy sm:inline-flex"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <AmniiListingCard
              key={listing.id}
              listing={listing}
              variant="urgent"
              badge={i === 0 ? "urgent" : i === 1 ? "new" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
