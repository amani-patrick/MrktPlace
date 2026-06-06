import { BadgeCheck, Shield, Star, Zap } from "lucide-react";
import { TRUST_BADGES } from "@/config/trust-badges";

const iconMap = {
  shield: Shield,
  star: Star,
  zap: Zap,
};

export function TrustBadgeExplainer() {
  return (
    <aside className="rounded-2xl border border-border/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-rw-green text-white">
          <BadgeCheck className="size-4" aria-hidden="true" />
        </span>
        <h3 className="font-heading font-bold">How agents earn badges</h3>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Our verification system is built for Rwanda — where trust comes from
        responsiveness on WhatsApp, accurate Kinyarwanda listings, and verified
        phone numbers.
      </p>

      <ul className="space-y-4">
        {Object.values(TRUST_BADGES).map((badge) => {
          const Icon = iconMap[badge.icon];
          return (
            <li key={badge.label} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-rw-blue/10 text-rw-blue">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{badge.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 rounded-lg border border-rw-yellow/30 bg-rw-yellow/10 px-3 py-2.5 text-xs text-foreground">
        <strong>Free to contact:</strong> Every agent&apos;s phone and WhatsApp are
        visible — no paywall, no hidden fees.
      </div>
    </aside>
  );
}
