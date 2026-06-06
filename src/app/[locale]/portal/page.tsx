import { Building2, Home, Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AmniiLogo } from "@/components/amnii/logo";
import { Link } from "@/i18n/navigation";

const portalOptions = [
  { role: "seeker" as const, href: "/portal/seeker", icon: Search, iconBg: "bg-amnii-navy" },
  { role: "owner" as const, href: "/portal/owner", icon: Home, iconBg: "bg-amnii-gold text-amnii-navy" },
  { role: "agent" as const, href: "/portal/agent", icon: Building2, iconBg: "bg-amnii-navy" },
];

export async function generateMetadata() {
  const t = await getTranslations("portal");
  return { title: t("workspace") };
}

export default async function PortalSelectorPage() {
  const t = await getTranslations("portal");

  return (
    <div className="flex min-h-screen flex-col bg-amnii-cream/40">
      <header className="border-b border-border/60 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <AmniiLogo />
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-amnii-navy"
          >
            ← {t("marketplace")}
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-amnii-navy sm:text-4xl">
            {t("chooseTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("chooseDesc")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {portalOptions.map((opt) => {
            const Icon = opt.icon;
            const title =
              opt.role === "seeker"
                ? t("seeker")
                : opt.role === "owner"
                  ? t("owner")
                  : t("agent");
            const desc =
              opt.role === "seeker"
                ? t("seekerDesc")
                : opt.role === "owner"
                  ? t("ownerDesc")
                  : t("agentDesc");

            return (
              <Link
                key={opt.role}
                href={opt.href}
                className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-amnii-gold/50 hover:shadow-md"
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl text-white ${opt.iconBg}`}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h2 className="font-heading text-lg font-bold text-amnii-navy group-hover:text-amnii-gold-dark">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-amnii-gold-dark">
                  {t("enterPortal")}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
