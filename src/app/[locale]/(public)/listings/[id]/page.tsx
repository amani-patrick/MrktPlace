import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
import { AgentReviewForm } from "@/components/agents/agent-review-form";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { FavoriteButton } from "@/components/amnii/favorite-button";
import { ListingReportButton } from "@/components/listings/listing-report-button";
import { RecordListingView } from "@/components/listings/record-listing-view";
import { ShareListingButton } from "@/components/listings/share-listing-button";
import { TrackContactLink } from "@/components/listings/track-contact-link";
import { buttonVariants } from "@/components/ui/button";
import { getListingById, getListingImages, getListings } from "@/lib/data/listings";
import { getListingSourceLabel, resolveListingContact } from "@/lib/listing-contact";
import { formatListingType, formatPrice } from "@/lib/format";
import { getListingImage } from "@/lib/images";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations("listing");
  const listing = await getListingById(id);

  if (!listing) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gallery = await getListingImages(id);
  const allListings = await getListings();
  const related = allListings.filter((l) => l.id !== id).slice(0, 3);
  const mainImage = getListingImage(listing.propertyType, listing.imageUrl);
  const galleryImages = gallery.length > 0 ? gallery : [mainImage];
  const contact = resolveListingContact(listing, t);
  const showAgentReview =
    listing.status === "active" &&
    listing.listingType === "rent" &&
    listing.listingSource === "agent_managed" &&
    listing.agentId;

  const isOwner = user?.id === listing.ownerId;
  const isPending = listing.status === "pending";

  return (
    <div className="bg-white">
      {listing.status === "active" ? <RecordListingView listingId={listing.id} /> : null}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {isPending ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="font-semibold text-amber-900">{t("pendingReview")}</p>
            <p className="mt-1 text-sm text-amber-800">{t("pendingReviewDesc")}</p>
            {isOwner ? (
              <p className="mt-2 text-xs text-amber-700">{t("pendingOwnerOnly")}</p>
            ) : null}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/search"
            className="text-sm font-medium text-muted-foreground hover:text-amnii-gold-dark"
          >
            {t("backToSearch")}
          </Link>
          <div className="flex items-center gap-2">
            <ShareListingButton title={listing.title} listingId={listing.id} url="" />
            <FavoriteButton listingId={listing.id} />
            <ListingReportButton
              listingId={listing.id}
              isAuthenticated={Boolean(user)}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-start">
          {/* Left — photos & key facts */}
          <div className="space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={galleryImages[0]}
                alt={listing.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>

            {galleryImages.length > 1 ? (
              <div className="grid grid-cols-3 gap-2">
                {galleryImages.slice(1, 4).map((src, i) => (
                  <div key={`${src}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`${listing.title} photo ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="20vw"
                    />
                  </div>
                ))}
              </div>
            ) : null}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amnii-cream px-3 py-1 text-xs font-semibold capitalize text-amnii-navy">
                  {formatListingType(listing.listingType)}
                </span>
                <span className="rounded-md bg-amnii-navy/10 px-3 py-1 text-xs font-semibold text-amnii-navy">
                  {getListingSourceLabel(listing.listingSource, t)}
                </span>
                {listing.verificationStatus === "verified" ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amnii-gold/20 px-3 py-1 text-xs font-semibold text-amnii-gold-dark">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    {t("verifiedListing")}
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

              {listing.agentName && listing.listingSource === "agent_managed" ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("listedWith", { name: listing.agentName ?? "" })}
                </p>
              ) : null}

              <p className="mt-4 text-3xl font-bold text-amnii-gold-dark">
                {formatPrice(listing.price, listing.currency)}
                {listing.listingType === "rent" ||
                listing.listingType === "commercial_rent" ? (
                  <span className="text-base font-medium text-muted-foreground">
                    {t("perMonth")}
                  </span>
                ) : null}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 rounded-xl border border-border bg-amnii-cream/40 p-4">
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
            </div>
          </div>

          {/* Right — description fills the space, then contact */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
            <div className="flex-1 rounded-2xl border border-border bg-amnii-cream/30 p-6">
              <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("description")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {listing.description || t("noDescription")}
              </p>

              {listing.features.length > 0 ? (
                <div className="mt-5 border-t border-border/60 pt-5">
                  <p className="text-xs font-semibold tracking-wide text-amnii-gold uppercase">
                    {t("amenities")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {listing.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-border bg-white px-2.5 py-0.5 text-xs capitalize"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold text-amnii-navy">
                {contact.label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("contactFree")}
              </p>

              <div className="mt-5 space-y-3">
                <TrackContactLink
                  listingId={listing.id}
                  type="contact_phone"
                  href={`tel:${contact.phone}`}
                  className={cn(
                    buttonVariants(),
                    "h-11 w-full gap-2 bg-amnii-navy text-white hover:bg-amnii-navy/90",
                  )}
                >
                  <Phone className="size-4" aria-hidden="true" />
                  {contact.phone}
                </TrackContactLink>
                {contact.whatsapp ? (
                  <TrackContactLink
                    listingId={listing.id}
                    type="contact_whatsapp"
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full gap-2 border-green-600 text-green-700 hover:bg-green-50",
                    )}
                  >
                    <MessageCircle className="size-4" aria-hidden="true" />
                    {t("whatsapp")}
                  </TrackContactLink>
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
                  <p className="text-sm font-semibold text-amber-900">{t("safetyWarning")}</p>
                  <p className="mt-1 text-sm text-amber-800">{t("safetyText")}</p>
                  {listing.listingSource === "owner_direct" ? (
                    <p className="mt-2 text-sm text-amber-800">{t("ownerDirectSeekerTip")}</p>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="font-heading text-xl font-bold text-amnii-navy">{t("location")}</h2>
          <div className="mt-3 flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-amnii-cream/50 text-sm text-muted-foreground">
            {listing.sector}, {listing.district}
          </div>
        </section>

        {showAgentReview ? (
          <section className="mt-10 max-w-xl">
            <AgentReviewForm
              agentId={listing.agentId!}
              listingId={listing.id}
              isAuthenticated={Boolean(user)}
            />
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-16 border-t border-border pt-12">
            <h2 className="font-heading text-2xl font-bold text-amnii-navy">{t("similar")}</h2>
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
