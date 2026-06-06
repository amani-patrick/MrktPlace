import { SAFETY_TIPS } from "@/config/constants";
import { amniiConfig } from "@/config/amnii";
import { Shield } from "lucide-react";

export const metadata = {
  title: "About Amnii",
  description: amniiConfig.description,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold text-amnii-navy sm:text-4xl">
        About {amniiConfig.name}
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        {amniiConfig.description}
      </p>

      <section id="safety" className="mt-12 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
            <Shield className="size-5" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-amnii-navy">
            Safety Guidelines
          </h2>
        </div>
        <ul className="mt-6 space-y-4">
          {SAFETY_TIPS.map((tip) => (
            <li
              key={tip.title}
              className="rounded-xl border border-border bg-amnii-cream/50 p-4"
            >
              <h3 className="font-semibold text-amnii-navy">{tip.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tip.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
