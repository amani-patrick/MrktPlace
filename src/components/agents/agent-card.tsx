import Link from "next/link";
import { BadgeCheck, MessageCircle, Phone } from "lucide-react";
import { AgentAvatar } from "@/components/agents/agent-avatar";
import { TRUST_BADGES } from "@/config/trust-badges";
import type { AgentProfile } from "@/types/agent";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: AgentProfile;
  compact?: boolean;
}

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const topBadge = agent.badges.includes("trusted_commissioner")
    ? TRUST_BADGES.trusted_commissioner
    : null;

  return (
    <Link
      href={`/agents/${agent.id}`}
      className={cn(
        "group relative flex gap-4 rounded-xl border border-border/80 bg-white p-4 shadow-sm transition-all hover:border-rw-blue/30 hover:shadow-md",
        compact ? "flex-col sm:flex-row" : "flex-row",
      )}
    >
      {topBadge ? (
        <div className="absolute top-0 right-0 flex items-center gap-1 rounded-bl-xl rounded-tr-xl bg-rw-green px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase">
          <BadgeCheck className="size-3" aria-hidden="true" />
          {topBadge.shortLabel}
        </div>
      ) : null}

      <AgentAvatar
        initials={agent.initials}
        colorClass={agent.avatarColor}
        size={compact ? "sm" : "md"}
        verified={agent.phoneVerified}
      />

      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="truncate font-semibold text-foreground group-hover:text-rw-blue">
          {agent.name}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Serves in{" "}
          <span className="font-medium text-foreground">
            {agent.servesIn.slice(0, 2).join(", ")}
            {agent.servesIn.length > 2 ? ` +${agent.servesIn.length - 2}` : ""}
          </span>
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Speaks {agent.languages.join(", ")}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {agent.rentCount > 0 ? (
            <span className="rounded-md bg-rw-blue/10 px-2 py-0.5 text-xs font-bold text-rw-blue">
              {agent.rentCount} RENT
            </span>
          ) : null}
          {agent.saleCount > 0 ? (
            <span className="rounded-md bg-rw-green/10 px-2 py-0.5 text-xs font-bold text-rw-green">
              {agent.saleCount} SALE
            </span>
          ) : null}
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {agent.responseTime} avg. response
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
        <div
          className="flex size-10 items-center justify-center rounded-lg border border-border/60 bg-muted/50 text-xs font-bold text-muted-foreground"
          title={agent.agency}
        >
          {agent.agencyShort}
        </div>
        <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-8 items-center justify-center rounded-full bg-rw-green/10 text-rw-green">
            <MessageCircle className="size-3.5" aria-hidden="true" />
          </span>
          <span className="flex size-8 items-center justify-center rounded-full bg-rw-blue/10 text-rw-blue">
            <Phone className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
