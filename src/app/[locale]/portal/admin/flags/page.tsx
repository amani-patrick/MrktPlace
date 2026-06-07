import { getTranslations } from "next-intl/server";
import { FlagDismissButton, ScamScanButton } from "@/components/admin/admin-actions";
import { getScamFlags } from "@/lib/data/analytics";

export const metadata = { title: "Admin — Flags" };

export default async function AdminFlagsPage() {
  const t = await getTranslations("admin");
  const flags = await getScamFlags();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-slate-900">{t("flagsTitle")}</h1>
            <p className="mt-1 text-sm text-slate-500">{t("flagsDesc")}</p>
          </div>
          <ScamScanButton label={t("flagsScan")} />
        </div>
      </div>

      {flags.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("flagsEmpty")}
        </p>
      ) : (
        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-semibold capitalize text-slate-900">
                  {flag.flagType.replaceAll("_", " ")} · score {flag.score}
                </p>
                <p className="mt-1 text-sm text-slate-600">{flag.reason}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {flag.entityType}
                  {flag.entityId ? ` · ${flag.entityId.slice(0, 8)}…` : null}
                </p>
              </div>
              <FlagDismissButton flagId={flag.id} label={t("flagsDismiss")} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
