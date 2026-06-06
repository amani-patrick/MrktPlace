import { cn } from "@/lib/utils";

interface PortalStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "blue" | "yellow" | "green";
}

const accentMap = {
  blue: "border-rw-blue/30 bg-rw-blue/5 text-rw-blue",
  yellow: "border-rw-yellow/40 bg-rw-yellow/10 text-foreground",
  green: "border-rw-green/30 bg-rw-green/5 text-rw-green",
};

export function PortalStatCard({
  label,
  value,
  hint,
  accent = "blue",
}: PortalStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm",
        accentMap[accent],
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
