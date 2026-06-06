import Link from "next/link";
import { BadgeCheck, Star } from "lucide-react";
import { getAgents } from "@/lib/data/agents";
import { AGENT_DISTRICT_TABS } from "@/lib/mock-agents";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Find Agents",
  description: "Browse verified real estate agents across Rwanda.",
};

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="bg-amnii-cream min-h-screen">
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-amnii-navy sm:text-4xl">
            Find Agents
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Verified commissioners and agents across Kigali. Contact them directly —
            free, via phone or WhatsApp.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {AGENT_DISTRICT_TABS.map((tab) => (
            <span
              key={tab.id}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium",
                tab.id === "all"
                  ? "bg-amnii-navy text-white"
                  : "border border-border bg-white text-muted-foreground",
              )}
            >
              {tab.label}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
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
                      <BadgeCheck
                        className="size-4 shrink-0 text-amnii-gold"
                        aria-label="Verified"
                      />
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.agency}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {agent.servesIn.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 font-medium">
                  <Star
                    className="size-3.5 fill-amnii-gold text-amnii-gold"
                    aria-hidden="true"
                  />
                  {agent.rating}
                </span>
                <span className="text-muted-foreground">
                  {agent.rentCount} rent · {agent.saleCount} sale
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
