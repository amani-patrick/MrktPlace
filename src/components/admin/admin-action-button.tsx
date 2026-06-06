"use client";

import { useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionButton({
  label,
  onClick,
  variant = "default",
}: {
  label: string;
  onClick: () => Promise<{ error?: string; success?: boolean }>;
  variant?: "approve" | "reject" | "default" | "outline";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          void onClick();
        });
      }}
      className={cn(
        buttonVariants({ size: "sm", variant: variant === "outline" ? "outline" : "default" }),
        variant === "approve" && "gap-1 bg-emerald-600 text-white hover:bg-emerald-700",
        variant === "reject" && "gap-1 border-red-200 text-red-600 hover:bg-red-50",
        variant === "default" && "bg-slate-900 text-white",
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {variant === "approve" ? <Check className="size-4" /> : null}
      {variant === "reject" ? <X className="size-4" /> : null}
      {label}
    </button>
  );
}
