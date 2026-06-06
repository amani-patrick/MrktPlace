"use client";

import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface HeaderAuthProps {
  email: string | null;
}

export function HeaderAuth({ email }: HeaderAuthProps) {
  const t = useTranslations("nav");
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hidden font-semibold text-amnii-navy sm:inline-flex",
        )}
      >
        {t("signIn")}
      </Link>
    );
  }

  const display = email.length > 22 ? `${email.slice(0, 20)}…` : email;

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="max-w-[140px] truncate text-xs font-medium text-muted-foreground">
        {display}
      </span>
      <button
        type="button"
        onClick={signOut}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        aria-label={t("signOut")}
      >
        <LogOut className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
