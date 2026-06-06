"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitAgentReview } from "@/app/actions/reviews";
import { useAuthPrompt } from "@/hooks/use-auth-prompt";
import { friendlyError } from "@/lib/notify";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentReviewFormProps {
  agentId: string;
  listingId?: string;
  isAuthenticated: boolean;
}

export function AgentReviewForm({
  agentId,
  listingId,
  isAuthenticated,
}: AgentReviewFormProps) {
  const t = useTranslations("reviews");
  const tNotify = useTranslations("notifications");
  const { openAuthPrompt } = useAuthPrompt();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthPrompt("review");
      return;
    }
    if (rating < 1) return;

    startTransition(async () => {
      const result = await submitAgentReview({ agentId, listingId, rating, comment });
      if (result.error === "auth_required") {
        openAuthPrompt("review");
        return;
      }
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", tNotify("reviewSubmitted"));
      setRating(0);
      setComment("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-white p-5">
      <h3 className="font-semibold text-amnii-navy">{t("title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("agentsOnly")}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t("accountRequired")}</p>
      <div className="mt-3 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={cn(
              "size-9 rounded-full border text-sm font-bold",
              rating >= n
                ? "border-amnii-gold bg-amnii-gold text-amnii-navy"
                : "border-border text-muted-foreground",
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
        className="mt-3 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-amnii-gold"
      />
      <Button
        type="submit"
        disabled={pending || rating < 1}
        className="mt-3 bg-amnii-gold font-semibold text-amnii-navy"
      >
        {pending ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
