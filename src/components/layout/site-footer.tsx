import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  discover: [
    { label: "Search listings", href: "/search" },
    { label: "Popular districts", href: "/districts" },
    { label: "Verified properties", href: "/search?verified=true" },
    { label: "Find agents", href: "/agents" },
  ],
  owners: [
    { label: "Post a listing", href: "/listings/new" },
    { label: "Owner dashboard", href: "/dashboard" },
    { label: "Listing tips", href: "/safety" },
  ],
  platform: [
    { label: "Safety tips", href: "/safety" },
    { label: "Report a scam", href: "/report" },
    { label: "About", href: "/about" },
  ],
} as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-heading text-lg font-semibold">{siteConfig.name}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="space-y-3">
              <p className="text-sm font-semibold capitalize">{section}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Free to use. No hidden fees. Contact details always visible.</p>
        </div>
      </div>
    </footer>
  );
}
