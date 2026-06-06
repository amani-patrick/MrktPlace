import { AlertTriangle, Shield } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function SafetyBanner() {
  const t = await getTranslations("home");

  return (
    <section className="bg-amnii-navy py-12" aria-labelledby="safety-banner">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:gap-10 lg:text-left lg:px-8">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amnii-gold/15 text-amnii-gold">
          <Shield className="size-8" aria-hidden="true" />
        </div>

        <div className="flex-1">
          <h2
            id="safety-banner"
            className="font-heading text-2xl font-bold text-white sm:text-3xl"
          >
            {t("safetyTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {t("safetyDesc")}
          </p>
          <div className="mt-4 inline-flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" aria-hidden="true" />
            <span>{t("safetyWarning")}</span>
          </div>
        </div>

        <Link
          href="/about#safety"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "shrink-0 border-amnii-gold/40 bg-transparent text-amnii-gold hover:bg-amnii-gold/10 hover:text-white",
          )}
        >
          {t("safetyCta")}
        </Link>
      </div>
    </section>
  );
}
