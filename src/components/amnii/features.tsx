import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

const featureKeys = ["verified", "contact", "local"] as const;
const icons = {
  verified: ShieldCheck,
  contact: Phone,
  local: MapPin,
} as const;

export async function AmniiFeatures() {
  const t = await getTranslations("home");
  const tFeatures = await getTranslations("features");

  return (
    <section className="bg-white py-14 lg:py-16" aria-labelledby="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            id="features"
            className="font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl"
          >
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            {t("featuresDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featureKeys.map((key) => {
            const Icon = icons[key];
            return (
              <div
                key={key}
                className="rounded-2xl border border-border/80 bg-amnii-cream/50 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-amnii-navy">
                  {tFeatures(`${key}Title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tFeatures(`${key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
