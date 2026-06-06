"use client";

import { useTranslations } from "next-intl";
import { Heart, Star, ShieldAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: "favorite" | "review" | "report";
}

export function AuthPromptDialog({
  open,
  onOpenChange,
  context = "favorite",
}: AuthPromptDialogProps) {
  const t = useTranslations("authPrompt");

  if (!open) return null;

  const Icon =
    context === "review" ? Star : context === "report" ? ShieldAlert : Heart;

  const title =
    context === "review"
      ? t("reviewTitle")
      : context === "report"
        ? t("reportTitle")
        : t("favoriteTitle");

  const description =
    context === "review"
      ? t("reviewDesc")
      : context === "report"
        ? t("reportDesc")
        : t("favoriteDesc");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label={t("close")}
        onClick={() => onOpenChange(false)}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-xl">
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amnii-navy text-amnii-gold">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-xl font-bold text-amnii-navy">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t("browseFree")}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/login"
            className={cn(buttonVariants(), "h-10 flex-1 bg-amnii-gold font-semibold text-amnii-navy")}
            onClick={() => onOpenChange(false)}
          >
            {t("signIn")}
          </Link>
          <Button
            type="button"
            variant="outline"
            className="h-10 flex-1"
            onClick={() => onOpenChange(false)}
          >
            {t("continueBrowsing")}
          </Button>
        </div>
      </div>
    </div>
  );
}
