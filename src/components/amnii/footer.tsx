import { getTranslations } from "next-intl/server";
import { amniiConfig, amniiNav } from "@/config/amnii";
import { Link } from "@/i18n/navigation";
import { AmniiLogo } from "./logo";

export async function AmniiFooter() {
  const t = await getTranslations("nav");
  const tFooter = await getTranslations("footer");
  const tCommon = await getTranslations("common");

  const footerLinks = [
    {
      title: tFooter("explore"),
      links: [
        ...amniiNav.map((item) => ({ label: t(item.key), href: item.href })),
        { label: t("search"), href: "/search" },
      ],
    },
    {
      title: tFooter("forOwners"),
      links: [
        { label: tFooter("listYourProperty"), href: "/listings/new" },
        { label: tFooter("ownerPortal"), href: "/portal/owner" },
        { label: tFooter("pricing"), href: "/about" },
      ],
    },
    {
      title: tFooter("trustSafety"),
      links: [
        { label: tFooter("faq"), href: "/about#faq" },
        { label: tFooter("safetyGuidelines"), href: "/about#safety" },
        { label: tFooter("verifiedListings"), href: "/search?verified=true" },
        { label: tFooter("reportListing"), href: "/about" },
      ],
    },
  ] as const;

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
          <p>
            © {new Date().getFullYear()} {amniiConfig.name}. {tCommon("rightsReserved")}
          </p>
          <p>{tFooter("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
