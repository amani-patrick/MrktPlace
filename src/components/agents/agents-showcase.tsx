"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Search, User } from "lucide-react";
import { AgentCard } from "@/components/agents/agent-card";
import { TrustBadgeExplainer } from "@/components/agents/trust-badge-explainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AGENT_DISTRICT_TABS, mockAgents } from "@/lib/mock-agents";
import { cn } from "@/lib/utils";

interface AgentsShowcaseProps {
  limit?: number;
  showExplainer?: boolean;
  showSearch?: boolean;
}

export function AgentsShowcase({
  limit = 4,
  showExplainer = true,
  showSearch = true,
}: AgentsShowcaseProps) {
  const [district, setDistrict] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [agentName, setAgentName] = useState("");
  const [language, setLanguage] = useState("");

  const filteredAgents = useMemo(() => {
    return mockAgents.filter((agent) => {
      if (district !== "all" && agent.district !== district) return false;
      if (location && !agent.servesIn.some((s) => s.toLowerCase().includes(location.toLowerCase())))
        return false;
      if (agentName && !agent.name.toLowerCase().includes(agentName.toLowerCase())) return false;
      if (
        language &&
        !agent.languages.some((l) => l.toLowerCase().includes(language.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [district, location, agentName, language]);

  const displayedAgents = filteredAgents.slice(0, limit);

  return (
    <div>
      {showSearch ? (
        <div className="mb-6 rounded-2xl border border-border/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            {AGENT_DISTRICT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDistrict(tab.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  district === tab.id
                    ? "bg-rw-blue text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-rw-blue/10 hover:text-rw-blue",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Sector or area"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <div className="relative">
              <User
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                placeholder="Agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
            <Input
              placeholder="Language (e.g. Kinyarwanda)"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-10"
            />
            <Button className="h-10 gap-2 bg-rw-green font-semibold hover:bg-rw-green/90">
              <Search className="size-4" aria-hidden="true" />
              Find agent
            </Button>
          </div>
        </div>
      ) : null}

      <div className={cn("grid gap-6", showExplainer && "lg:grid-cols-[1fr_300px]")}>
        <div className="space-y-3">
          {displayedAgents.length > 0 ? (
            displayedAgents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
              No agents match your filters. Try a different district or area.
            </div>
          )}

          {limit < mockAgents.length ? (
            <div className="pt-2 text-center">
              <Link
                href="/agents"
                className="text-sm font-semibold text-rw-blue hover:underline"
              >
                View all {mockAgents.length} verified agents →
              </Link>
            </div>
          ) : null}
        </div>

        {showExplainer ? <TrustBadgeExplainer /> : null}
      </div>
    </div>
  );
}
