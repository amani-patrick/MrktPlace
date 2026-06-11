"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { BadgeCheck, Star } from "lucide-react";
import { DistrictSelect } from "@/components/amnii/district-select";
import { FEATURED_DISTRICTS } from "@/config/districts";
import type { AgentProfile } from "@/types/agent";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface AgentsDirectoryProps {
  agents: AgentProfile[];
}

export function AgentsDirectory({ agents }: AgentsDirectoryProps) {
  const t = useTranslations("agents");
  const [district, setDistrict] = useState<string>("");

  const filtered = useMemo(() => {
    if (!district) return agents;
    return agents.filter((a) => a.district.toLowerCase() === district.toLowerCase());
  }, [agents, district]);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDistrict("")}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            !district
              ? "bg-amnii-navy text-white"
              : "border border-border bg-white text-muted-foreground hover:border-amnii-gold",
          )}
        >
          {t("allAgentsNationwide")}
        </button>
        {FEATURED_DISTRICTS.map((d) => (
          <button
            key={d.slug}
            type="button"
            onClick={() => setDistrict(d.name)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              district === d.name
                ? "bg-amnii-navy text-white"
                : "border border-border bg-white text-muted-foreground hover:border-amnii-gold",
            )}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="mb-6 max-w-xs">
        <DistrictSelect value={district} onChange={setDistrict} />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
          {t("noAgentsInDistrict")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="group rounded-2xl border border-border/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white",
                    agent.avatarColor,
                  )}
                >
                  {agent.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h2 className="truncate font-semibold text-amnii-navy group-hover:text-amnii-gold-dark">
                      {agent.name}
                    </h2>
                    {agent.phoneVerified ? (
                      <BadgeCheck className="size-4 shrink-0 text-amnii-gold" aria-hidden="true" />
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.agency}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star className="size-3.5 fill-amnii-gold text-amnii-gold" aria-hidden="true" />
                  {agent.rating != null ? agent.rating : t("noRatingYet")}
                </span>
                <span className="text-muted-foreground">
                  {t("rentSale", { rent: agent.rentCount, sale: agent.saleCount })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
