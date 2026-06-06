import { PLATFORM_STATS } from "@/config/constants";
import { cn } from "@/lib/utils";

const colorMap = {
  primary: "text-rw-blue",
  secondary: "text-rw-yellow",
  accent: "text-rw-green",
} as const;

export function TrustStatsBar() {
  return (
    <section className="border-b border-border/60 bg-white" aria-label="Platform statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={cn(
              "relative px-4 py-6 text-center sm:py-8",
              index < PLATFORM_STATS.length - 1 && "lg:border-r lg:border-border/60",
              index % 2 === 0 && "border-r border-border/60 lg:border-r",
            )}
          >
            <p
              className={cn(
                "font-heading text-2xl font-bold sm:text-3xl",
                colorMap[stat.color],
              )}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
