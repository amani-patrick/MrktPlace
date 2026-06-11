import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  Building2,
  MessageCircle,
  Phone,
  Star,
  Timer,
} from "lucide-react";
import { AgentReportButton } from "@/components/agents/agent-report-button";
import { AgentReviewForm } from "@/components/agents/agent-review-form";
import { AmniiListingCard } from "@/components/amnii/listing-card";
import { TRUST_BADGES } from "@/config/trust-badges";
import { buttonVariants } from "@/components/ui/button";
import { getAgentById } from "@/lib/data/agents";
import { getListings } from "@/lib/data/listings";
import { getAgentReviews } from "@/lib/data/reviews";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AgentProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { id } = await params;
  const t = await getTranslations("agents");
  const agent = await getAgentById(id);

  if (!agent) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const listings = (await getListings()).filter((l) => l.agentId === id).slice(0, 6);
  const reviews = await getAgentReviews(id);

  return (
    <div className="bg-amnii-cream min-h-screen">
      <div className="bg-amnii-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/agents" className="text-sm font-medium text-white/60 hover:text-amnii-gold">
            {t("allAgents")}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div
              className={cn(
                "flex size-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-bold text-white shadow-lg",
                agent.avatarColor,
              )}
            >
              {agent.initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-3xl font-bold sm:text-4xl">{agent.name}</h1>
                {agent.phoneVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amnii-gold px-3 py-1 text-xs font-bold text-amnii-navy">
                    <BadgeCheck className="size-3.5" aria-hidden="true" />
                    {t("verifiedAgent")}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-white/70">
                {agent.agency} · {t("serves", { areas: agent.servesIn.join(", ") })}
              </p>
              <p className="mt-1 text-sm text-white/50">
                {t("speaks", { languages: agent.languages.join(", ") })}
              </p>

              <div className="mt-5 flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                  <Star className="size-4 fill-amnii-gold text-amnii-gold" aria-hidden="true" />
                  {agent.rating != null
                    ? `${agent.rating} ${t("rating")}`
                    : t("noRatingYet")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                  <Timer className="size-4" aria-hidden="true" />
                  {agent.responseTime
                    ? `${agent.responseTime} ${t("avgResponse")}`
                    : t("noResponseYet")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-white/70">
                  <Building2 className="size-4" aria-hidden="true" />
                  {t("rentSale", { rent: agent.rentCount, sale: agent.saleCount })}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {agent.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium"
                  >
                    {TRUST_BADGES[badge].shortLabel}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <AgentReportButton agentId={agent.id} isAuthenticated={Boolean(user)} />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:shrink-0">
              <a
                href={`https://wa.me/${agent.whatsapp.replace(/\D/g, "")}`}
                className={cn(
                  buttonVariants(),
                  "h-11 gap-2 bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
                )}
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                {t("whatsapp")}
              </a>
              <a
                href={`tel:${agent.whatsapp}`}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 gap-2 border-white/30 bg-transparent text-white hover:bg-white/10",
                )}
              >
                <Phone className="size-4" aria-hidden="true" />
                {t("callAgent")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-heading text-2xl font-bold text-amnii-navy">{t("activeListings")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("managedBy", { name: agent.name.split(" ")[0] })}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <AmniiListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-heading text-2xl font-bold text-amnii-navy">{t("reviews")}</h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">{t("noReviews")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl border border-border bg-white p-4">
                    <p className="font-medium text-amnii-navy">
                      {"★".repeat(r.rating)}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {r.reviewerName ?? "Tenant"}
                      </span>
                    </p>
                    {r.comment ? (
                      <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <AgentReviewForm agentId={agent.id} isAuthenticated={Boolean(user)} />
        </section>
      </div>
    </div>
  );
}
