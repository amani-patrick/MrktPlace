import Link from "next/link";
import { Building2, Home, Search } from "lucide-react";
import { RwandaColorBar } from "@/components/layout/rwanda-color-bar";
import { PORTAL_OPTIONS } from "@/config/portal";
import { siteConfig } from "@/config/site";

const iconMap = {
  seeker: Search,
  owner: Home,
  agent: Building2,
} as const;

export const metadata = {
  title: "Portals",
};

export default function PortalSelectorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <RwandaColorBar />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-16 sm:px-6">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="mb-6 inline-block text-sm font-medium text-muted-foreground hover:text-primary"
          >
            &larr; Back to {siteConfig.name}
          </Link>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Choose your portal
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Select the workspace that matches your role. Authentication will connect
            these portals once accounts are live.
          </p>
        </div>

        <div className="grid gap-4">
          {PORTAL_OPTIONS.map((portal) => {
            const Icon = iconMap[portal.role];
            return (
              <Link
                key={portal.role}
                href={portal.href}
                className={`group flex items-start gap-4 rounded-2xl border-2 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${portal.color}`}
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${portal.iconColor}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold">{portal.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {portal.description}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-primary group-hover:underline">
                    Enter portal &rarr;
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Admin portal is managed separately and not available here.
        </p>
      </div>
    </div>
  );
}
