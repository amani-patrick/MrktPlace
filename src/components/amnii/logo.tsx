import Link from "next/link";
import { amniiConfig } from "@/config/amnii";
import { cn } from "@/lib/utils";

interface AmniiLogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export function AmniiLogo({ variant = "dark", className }: AmniiLogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className={cn("group inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-heading text-xl font-bold tracking-tight",
          isLight ? "text-white" : "text-amnii-navy",
        )}
      >
        {amniiConfig.name}
      </span>
      <span
        className={cn(
          "mt-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase",
          isLight ? "text-amnii-gold" : "text-amnii-gold-dark",
        )}
      >
        {amniiConfig.tagline}
      </span>
    </Link>
  );
}
