"use client";

import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/lib/utils";

interface ShareListingButtonProps {
  title: string;
  url?: string;
  className?: string;
}

export function ShareListingButton({ title, url, className }: ShareListingButtonProps) {
  const t = useTranslations("listing");
  const tNotify = useTranslations("notifications");
  const { showToast } = useToast();

  function share() {
    const pageUrl = url || (typeof window !== "undefined" ? window.location.href : "");
    const text = `${title} — ${pageUrl}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank", "noopener,noreferrer");
    showToast("success", tNotify("shareOpened"));
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-2",
        className,
      )}
    >
      <Share2 className="size-4" aria-hidden="true" />
      {t("shareWhatsApp")}
    </button>
  );
}
