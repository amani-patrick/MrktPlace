import {
  Building2,
  Handshake,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/amnii/faq-accordion";
import { buttonVariants } from "@/components/ui/button";
import { amniiConfig } from "@/config/amnii";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return {
    title: t("label"),
    description: amniiConfig.description,
  };
}

const valueIcons = [Shield, Handshake, MapPin] as const;
const valueKeys = ["trust", "direct", "rwanda"] as const;
const stepKeys = ["step1", "step2", "step3"] as const;
const roleKeys = ["seekers", "owners", "agents"] as const;
const roleIcons = [Users, Building2, Handshake] as const;
const roleHrefs = ["/portal/seeker", "/portal/owner", "/portal/agent"] as const;
const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;
const safetyTipKeys = [1, 2, 3, 4] as const;

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tFaq = await getTranslations("faq");

  const faqItems = faqKeys.map((key) => ({
    question: tFaq(key),
    answer: tFaq(key.replace("q", "a")),
  }));

  const stats = [
    { value: "30", label: t("stats.districts") },
    { value: "100%", label: t("stats.contact") },
    { value: "0", label: t("stats.fees") },
    { value: "24/7", label: t("stats.browse") },
  ];

  return (
    <div className="bg-white">
      <section className="bg-amnii-navy text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-sm font-semibold tracking-[0.2em] text-amnii-gold uppercase">
            {t("label")}
          </p>
          <h1 className="mt-3 max-w-2xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            {t("heroDesc")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/search"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
              )}
            >
              {t("browse")}
            </Link>
            <Link
              href="/listings/new"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10",
              )}
            >
              {t("list")}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-amnii-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <p className="font-heading text-3xl font-bold text-amnii-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold text-amnii-navy">{t("valuesTitle")}</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">{t("valuesDesc")}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {valueKeys.map((key, i) => {
            const Icon = valueIcons[i];
            return (
              <div
                key={key}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-amnii-navy">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-amnii-cream/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold text-amnii-navy">
            {t("howTitle")}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stepKeys.map((key, i) => (
              <div
                key={key}
                className="relative rounded-2xl border border-border/80 bg-white p-6"
              >
                <span className="font-heading text-4xl font-bold text-amnii-gold/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-xl font-bold text-amnii-navy">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-bold text-amnii-navy">
          {t("rolesTitle")}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {roleKeys.map((key, i) => {
            const Icon = roleIcons[i];
            return (
              <Link
                key={key}
                href={roleHrefs[i]}
                className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amnii-gold/40 hover:shadow-md"
              >
                <Icon
                  className="size-8 text-amnii-gold transition-colors group-hover:text-amnii-navy"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-heading text-lg font-bold text-amnii-navy">
                  {t(`${key}Title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(`${key}Desc`)}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-amnii-gold-dark group-hover:underline">
                  {t("openPortal")}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-amnii-cream/60 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-heading text-3xl font-bold text-amnii-navy">
            {t("faqTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-muted-foreground">
            {t("faqDesc")}
          </p>
          <div className="mt-10">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <section id="safety" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          <div className="lg:w-1/3">
            <div className="inline-flex size-12 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
              <Shield className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 font-heading text-3xl font-bold text-amnii-navy">
              {t("safetyTitle")}
            </h2>
            <p className="mt-3 text-muted-foreground">{t("safetyIntro")}</p>
          </div>
          <ul className="grid flex-1 gap-4 sm:grid-cols-2">
            {safetyTipKeys.map((n) => (
              <li
                key={n}
                className="rounded-xl border border-border bg-amnii-cream/40 p-5"
              >
                <h3 className="font-semibold text-amnii-navy">
                  {t(`safetyTip${n}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`safetyTip${n}Desc`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
