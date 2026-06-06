"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { submitRentalOutcome } from "@/app/actions/rental-outcome";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";

interface RentalOutcomePromptProps {
  listingId: string;
  listingTitle: string;
  agentId: string | null;
}

export function RentalOutcomePrompt({
  listingId,
  listingTitle,
  agentId,
}: RentalOutcomePromptProps) {
  const t = useTranslations("rentalOutcome");
  const { showToast } = useToast();
  const [visible, setVisible] = useState(true);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(`rental-prompt-${listingId}`);
    if (dismissed) setVisible(false);
  }, [listingId]);

  function respond(outcome: "rented" | "still_looking" | "not_interested") {
    startTransition(async () => {
      const result = await submitRentalOutcome(listingId, agentId, outcome);
      if (result?.error) {
        showToast("error", result.error);
        return;
      }
      sessionStorage.setItem(`rental-prompt-${listingId}`, "1");
      setVisible(false);
      showToast("success", t("thanks"));
    });
  }

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-amnii-gold/40 bg-amnii-cream/50 p-5">
      <p className="font-semibold text-amnii-navy">{t("title")}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("subtitle", { listing: listingTitle })}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={pending}
          className="bg-amnii-navy text-white"
          onClick={() => respond("rented")}
        >
          {t("rented")}
        </Button>
        <Button size="sm" variant="outline" disabled={pending} onClick={() => respond("still_looking")}>
          {t("stillLooking")}
        </Button>
        <Button size="sm" variant="ghost" disabled={pending} onClick={() => respond("not_interested")}>
          {t("notInterested")}
        </Button>
      </div>
    </div>
  );
}
