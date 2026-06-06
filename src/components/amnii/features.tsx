import { MapPin, Phone, ShieldCheck } from "lucide-react";
import { amniiFeatures } from "@/config/amnii";

const icons = {
  shield: ShieldCheck,
  phone: Phone,
  map: MapPin,
} as const;

export function AmniiFeatures() {
  return (
    <section className="bg-white py-14 lg:py-16" aria-labelledby="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2
            id="features"
            className="font-heading text-2xl font-bold tracking-tight text-amnii-navy sm:text-3xl"
          >
            Why choose Amnii?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Built for Rwanda&apos;s housing market — transparent, local, and always free to browse
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {amniiFeatures.map((feature) => {
            const Icon = icons[feature.icon];
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-border/80 bg-amnii-cream/50 p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-amnii-navy">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
