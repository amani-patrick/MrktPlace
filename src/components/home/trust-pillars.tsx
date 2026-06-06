import { BadgeCheck, MapPin, MessageCircle, Shield } from "lucide-react";
import { RWANDA_TRUST_PILLARS } from "@/config/trust-badges";
import { cn } from "@/lib/utils";

const iconMap = [MessageCircle, BadgeCheck, Shield, MapPin];

const colorMap = {
  blue: "border-rw-blue/20 bg-rw-blue/5 text-rw-blue",
  green: "border-rw-green/20 bg-rw-green/5 text-rw-green",
  yellow: "border-rw-yellow/30 bg-rw-yellow/10 text-foreground",
};

export function TrustPillars() {
  return (
    <section
      className="border-y border-border/60 bg-white"
      aria-label="Why trust Rwanda Housing"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold tracking-wide text-rw-green uppercase">
            Built for Rwanda
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
            Why people trust us
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RWANDA_TRUST_PILLARS.map((pillar, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={pillar.title}
                className={cn(
                  "rounded-xl border p-5 transition-transform hover:-translate-y-0.5",
                  colorMap[pillar.color],
                )}
              >
                <Icon className="mb-3 size-6" aria-hidden="true" />
                <h3 className="font-semibold">{pillar.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed opacity-80">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
