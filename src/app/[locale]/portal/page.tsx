import Link from "next/link";
import { Building2, Home, Search } from "lucide-react";
import { AmniiLogo } from "@/components/amnii/logo";
import { PORTAL_OPTIONS } from "@/config/portal";

const iconMap = {
  seeker: Search,
  owner: Home,
  agent: Building2,
} as const;

export const metadata = {
  title: "Your Portal",
};

export default function PortalSelectorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-amnii-cream/40">
      <header className="border-b border-border/60 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <AmniiLogo />
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-amnii-navy"
          >
            ← Home
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-amnii-navy sm:text-4xl">
            Choose your workspace
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Select the portal that matches your role. Sign in to sync your data across devices.
          </p>
        </div>

        <div className="grid gap-4">
          {PORTAL_OPTIONS.map((portal) => {
            const Icon = iconMap[portal.role];
            return (
              <Link
                key={portal.role}
                href={portal.href}
                className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amnii-gold/40 hover:shadow-lg"
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-white ${portal.iconBg}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold text-amnii-navy">
                    {portal.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{portal.description}</p>
                  <span className="mt-3 inline-block text-sm font-semibold text-amnii-gold-dark group-hover:underline">
                    Enter portal →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
