import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Bath,
  BedDouble,
  Car,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  ShieldCheck,
} from "lucide-react";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { buttonVariants } from "@/components/ui/button";
import { getListingById, getListingImages, getListings } from "@/lib/data/listings";
import { getListingSourceLabel, resolveListingContact } from "@/lib/listing-contact";
import { formatListingType, formatPrice } from "@/lib/format";
import { getListingImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) notFound();

  const gallery = await getListingImages(id);
  const allListings = await getListings();
  const related = allListings.filter((l) => l.id !== id).slice(0, 3);
  const mainImage = getListingImage(listing.propertyType, listing.imageUrl);
  const galleryImages = gallery.length > 0 ? gallery : [mainImage];
  const contact = resolveListingContact(listing);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/search"
          className="text-sm font-medium text-muted-foreground hover:text-amnii-gold-dark"
        >
          ← Back to search
        </Link>

        <div className="mt-4 grid gap-2 overflow-hidden rounded-2xl sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative aspect-[16/10] sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[400px]">
            <Image
              src={galleryImages[0]}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {galleryImages.slice(1, 4).map((src, i) => (
            <div key={`${src}-${i}`} className="relative hidden aspect-[4/3] sm:block">
              <Image
                src={src}
                alt={`${listing.title} photo ${i + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amnii-cream px-3 py-1 text-xs font-semibold capitalize text-amnii-navy">
                {formatListingType(listing.listingType)}
              </span>
              <span className="rounded-md bg-amnii-navy/10 px-3 py-1 text-xs font-semibold text-amnii-navy">
                {getListingSourceLabel(listing.listingSource)}
              </span>
              {listing.verificationStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-amnii-gold/20 px-3 py-1 text-xs font-semibold text-amnii-gold-dark">
                  <ShieldCheck className="size-3.5" aria-hidden="true" />
                  Verified listing
                </span>
              ) : null}
              {listing.agentName && listing.listingSource === "agent_managed" ? (
                <span className="text-xs text-muted-foreground">
                  via {listing.agentName}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 font-heading text-3xl font-bold text-amnii-navy sm:text-4xl">
              {listing.title}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4 text-amnii-gold" aria-hidden="true" />
              {listing.sector}, {listing.district}, Rwanda
            </p>

            <p className="mt-4 text-3xl font-bold text-amnii-gold-dark">
              {formatPrice(listing.price, listing.currency)}
              {listing.listingType === "rent" ||
              listing.listingType === "commercial_rent" ? (
                <span className="text-base font-medium text-muted-foreground"> /month</span>
              ) : null}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 rounded-xl border border-border bg-amnii-cream/40 p-4">
              {listing.bedrooms !== null ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <BedDouble className="size-5 text-amnii-navy" aria-hidden="true" />
                  {listing.bedrooms} Bedrooms
                </span>
              ) : null}
              {listing.bathrooms !== null ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Bath className="size-5 text-amnii-navy" aria-hidden="true" />
                  {listing.bathrooms} Bathrooms
                </span>
              ) : null}
              {listing.parkingSpaces ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Car className="size-5 text-amnii-navy" aria-hidden="true" />
                  {listing.parkingSpaces} Parking
                </span>
              ) : null}
              {listing.squareMeters ? (
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <Ruler className="size-5 text-amnii-navy" aria-hidden="true" />
                  {listing.squareMeters} m²
                </span>
              ) : null}
            </div>

            <section className="mt-8">
              <h2 className="font-heading text-xl font-bold text-amnii-navy">Description</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {listing.description}
              </p>
            </section>

            {listing.features.length > 0 ? (
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-amnii-navy">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-border bg-white px-3 py-1 text-sm capitalize"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="mt-8">
              <h2 className="font-heading text-xl font-bold text-amnii-navy">Location</h2>
              <div className="mt-3 flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-amnii-cream/50 text-sm text-muted-foreground">
                Map preview — {listing.sector}, {listing.district}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-amnii-navy">
                {contact.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Free to contact — no unlock fees
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href={`tel:${contact.phone}`}
                  className={cn(
                    buttonVariants(),
                    "h-11 w-full gap-2 bg-amnii-navy text-white hover:bg-amnii-navy/90",
                  )}
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {contact.phone}
                </a>
                {contact.whatsapp ? (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full gap-2 border-green-600 text-green-700 hover:bg-green-50",
                    )}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                ) : null}
                {contact.secondary ? (
                  <div className="border-t border-border pt-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      {contact.secondary.label}
                    </p>
                    <a
                      href={`tel:${contact.secondary.phone}`}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-full gap-2 text-sm",
                      )}
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {contact.secondary.phone}
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle
                  className="size-5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Safety warning</p>
                  <p className="mt-1 text-sm text-amber-800">
                    Never send money before visiting the property in person. Verify the
                    owner and inspect the property before any payment.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-heading text-2xl font-bold text-amnii-navy">
              Similar properties
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((l) => (
                <AmniiListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
