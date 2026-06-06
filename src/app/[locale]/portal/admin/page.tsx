import { AlertTriangle, Building2, Shield, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const t = await getTranslations("admin");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queue = [
    { label: t("pendingListings"), value: 4, href: "/portal/admin/listings", icon: Building2 },
    { label: t("openReports"), value: 7, href: "/portal/admin/reports", icon: AlertTriangle },
    { label: t("flaggedUsers"), value: 2, href: "/portal/admin/users", icon: Users },
    {
      label: t("verificationRequests"),
      value: 3,
      href: "/portal/admin/listings",
      icon: Shield,
    },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
        {user?.email ? (
          <p className="mt-3 text-sm font-medium text-amnii-gold-dark">
            {t("welcome", { email: user.email })}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {queue.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-slate-900 text-amnii-gold">
              <item.icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="font-heading text-2xl font-bold text-slate-900">{item.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">{t("accessTitle")}</p>
        <p className="mt-2 leading-relaxed">{t("accessDesc")}</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
          <li>{t("seedStep")}</li>
          <li>{t("signInStep")}</li>
          <li>{t("redirectStep")}</li>
        </ol>
        <Link
          href="/portal/admin/reports"
          className={cn(buttonVariants({ size: "sm" }), "mt-4 bg-slate-900 text-white")}
        >
          {t("reviewReports")}
        </Link>
      </div>
    </div>
  );
}
