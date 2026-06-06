"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { submitFeedback } from "@/app/actions/feedback";
import { friendlyError } from "@/lib/notify";
import { useToast } from "@/providers/toast-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const t = useTranslations("feedback");
  const tNotify = useTranslations("notifications");
  const { showToast } = useToast();
  const pathname = usePathname();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!open) return null;

  function handleSubmit() {
    if (rating < 1) return;
    startTransition(async () => {
      const result = await submitFeedback({
        rating,
        comment,
        triggerType: "engagement_threshold",
        pagePath: pathname,
      });
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", tNotify("feedbackThanks"));
      setDone(true);
      window.setTimeout(() => onOpenChange(false), 1200);
    });
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={t("close")}
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
        {done ? (
          <p className="py-4 text-center text-sm font-medium text-amnii-gold-dark">
            {t("thanks")}
          </p>
        ) : (
          <>
            <h2 className="font-heading text-lg font-bold text-amnii-navy">{t("title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-4 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={cn(
                    "size-10 rounded-full border text-sm font-bold transition-colors",
                    rating >= n
                      ? "border-amnii-gold bg-amnii-gold text-amnii-navy"
                      : "border-border text-muted-foreground hover:border-amnii-gold",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("placeholder")}
              rows={3}
              className="mt-4 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20"
            />
            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                disabled={pending || rating < 1}
                onClick={handleSubmit}
                className="flex-1 bg-amnii-gold font-semibold text-amnii-navy"
              >
                {pending ? t("sending") : t("submit")}
              </Button>
              <button
                type="button"
                className={cn(buttonVariants({ variant: "ghost" }), "flex-1")}
                onClick={() => onOpenChange(false)}
              >
                {t("skip")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
