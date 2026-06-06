import Link from "next/link";
import {
  Building2,
  DoorOpen,
  Home,
  LandPlot,
  LayoutGrid,
  Store,
} from "lucide-react";
import { QUICK_BROWSE } from "@/config/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  building: Building2,
  home: Home,
  door: DoorOpen,
  layout: LayoutGrid,
  store: Store,
  map: LandPlot,
} as const;

const colorCycle = [
  "bg-rw-blue/10 text-rw-blue group-hover:bg-rw-blue group-hover:text-white",
  "bg-rw-green/10 text-rw-green group-hover:bg-rw-green group-hover:text-white",
  "bg-rw-yellow/20 text-foreground group-hover:bg-rw-yellow group-hover:text-foreground",
] as const;

export function QuickBrowse() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {QUICK_BROWSE.map((item, index) => {
        const Icon = iconMap[item.icon];
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border/80 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-full transition-colors",
                colorCycle[index % colorCycle.length],
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-xs font-semibold text-foreground sm:text-sm">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
