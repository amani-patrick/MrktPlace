import Link from "next/link";
import { Bell, Heart } from "lucide-react";
import { amniiNav } from "@/config/amnii";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { AmniiLogo } from "./logo";
import { HeaderAuth } from "./header-auth";

export async function AmniiHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const phone = user?.phone ?? null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <AmniiLogo />

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex" aria-label="Main">
          {amniiNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-amnii-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
            aria-label="Saved properties"
          >
            <Heart className="size-5" />
          </button>
          <button
            type="button"
            className="hidden rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-amnii-navy sm:inline-flex"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </button>
          <HeaderAuth phone={phone} />
          <Link
            href="/listings/new"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-amnii-gold font-semibold text-amnii-navy hover:bg-amnii-gold-dark hover:text-white",
            )}
          >
            List Property
          </Link>
        </div>
      </div>
    </header>
  );
}
