import Link from "next/link";
import { amniiConfig, amniiNav } from "@/config/amnii";
import { AmniiLogo } from "./logo";

const footerLinks = [
  {
    title: "Explore",
    links: [
      ...amniiNav,
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { label: "List Your Property", href: "/listings/new" },
      { label: "Owner Portal", href: "/portal/owner" },
      { label: "Pricing", href: "/about" },
    ],
  },
  {
    title: "Trust & Safety",
    links: [
      { label: "Safety Guidelines", href: "/about#safety" },
      { label: "Verified Listings", href: "/search?verified=true" },
      { label: "Report a Listing", href: "/about" },
    ],
  },
] as const;

export function AmniiFooter() {
  return (
    <footer className="bg-amnii-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <AmniiLogo variant="light" />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              {amniiConfig.description}
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {amniiConfig.name}. All rights reserved.</p>
          <p>Made for Rwanda · Free to browse · Contact always visible</p>
        </div>
      </div>
    </footer>
  );
}
