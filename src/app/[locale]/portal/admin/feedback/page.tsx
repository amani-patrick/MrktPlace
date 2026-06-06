import { getTranslations } from "next-intl/server";
import { getAdminFeedback } from "@/lib/data/admin";

export const metadata = { title: "Admin — Feedback" };

export default async function AdminFeedbackPage() {
  const t = await getTranslations("admin");
  const feedback = await getAdminFeedback();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("feedbackTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("feedbackDesc")}</p>
      </div>

      {feedback.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noFeedback")}
        </p>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">
                  {item.userEmail ?? "Anonymous"}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {item.rating
                  ? t("feedbackRating", { rating: item.rating })
                  : t("feedbackNoRating")}
              </p>
              {item.comment ? (
                <p className="mt-1 text-sm text-slate-700">{item.comment}</p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">
                {t("feedbackTrigger", { type: item.triggerType })}
                {item.pagePath ? ` · ${item.pagePath}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
