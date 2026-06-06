import { cn } from "@/lib/utils";

interface PortalStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "navy" | "gold" | "cream";
}

const accentMap = {
  navy: "border-amnii-navy/15 bg-white text-amnii-navy",
  gold: "border-amnii-gold/30 bg-white text-amnii-gold-dark",
  cream: "border-border bg-amnii-cream/50 text-amnii-navy",
};

export function PortalStatCard({
  label,
  value,
  hint,
  accent = "navy",
}: PortalStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md",
        accentMap[accent],
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
