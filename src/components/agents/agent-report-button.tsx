"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { reportAgent } from "@/app/actions/reviews";
import { useAuthPrompt } from "@/hooks/use-auth-prompt";
import { friendlyError } from "@/lib/notify";
import { useToast } from "@/providers/toast-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentReportButtonProps {
  agentId: string;
  isAuthenticated: boolean;
}

export function AgentReportButton({ agentId, isAuthenticated }: AgentReportButtonProps) {
  const t = useTranslations("reviews");
  const tNotify = useTranslations("notifications");
  const { openAuthPrompt } = useAuthPrompt();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!isAuthenticated) {
      openAuthPrompt("report");
      return;
    }
    startTransition(async () => {
      const result = await reportAgent({ agentId, reason, details });
      if (result.error === "auth_required") {
        openAuthPrompt("report");
        return;
      }
      if (result.error) {
        showToast("error", friendlyError(tNotify, String(result.error)));
        return;
      }
      showToast("success", tNotify("reportSubmitted"));
      setOpen(false);
      setReason("");
      setDetails("");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!isAuthenticated) {
            openAuthPrompt("report");
            return;
          }
          setOpen(true);
        }}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "border-red-200 text-red-600")}
      >
        {t("reportAgent")}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-amnii-navy">{t("reportTitle")}</h3>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("reportReason")}
              className="mt-3 h-10 w-full rounded-lg border border-border px-3 text-sm"
              required
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t("reportDetails")}
              rows={3}
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <Button
              type="button"
              disabled={pending || !reason.trim()}
              onClick={submit}
              className="mt-4 w-full bg-slate-900 text-white"
            >
              {pending ? tNotify("sending") : t("reportSubmit")}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
