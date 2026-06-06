import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AmniiLogo } from "@/components/amnii/logo";
import { Link } from "@/i18n/navigation";

const adminNav = [
  { key: "navOverview", href: "/portal/admin" },
  { key: "navListings", href: "/portal/admin/listings" },
  { key: "navReports", href: "/portal/admin/reports" },
  { key: "navUsers", href: "/portal/admin/users" },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("admin");

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">{t("exit")}</span>
            </Link>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <LayoutDashboard className="size-4 text-amnii-gold" />
              Admin
            </span>
          </div>
          <AmniiLogo variant="light" className="scale-90" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="lg:w-52">
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-900 lg:w-full"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
