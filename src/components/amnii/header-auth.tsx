"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface HeaderAuthProps {
  phone: string | null;
}

export function HeaderAuth({ phone }: HeaderAuthProps) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!phone) {
    return (
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "hidden font-semibold text-amnii-navy sm:inline-flex",
        )}
      >
        Sign In
      </Link>
    );
  }

  const display = phone.replace(/^\+250/, "0");

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <span className="text-xs font-medium text-muted-foreground">{display}</span>
      <button
        type="button"
        onClick={signOut}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        aria-label="Sign out"
      >
        <LogOut className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
