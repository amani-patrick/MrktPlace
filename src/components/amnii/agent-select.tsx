"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { AgentOption } from "@/lib/data/listings";

interface AgentSelectProps {
  agents: AgentOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function AgentSelect({ agents, value, onChange, required, className }: AgentSelectProps) {
  const t = useTranslations("listPropertyForm");
  const tSelect = useTranslations("searchableSelect");

  const options = useMemo(
    () =>
      agents.map((agent) => ({
        value: agent.id,
        label: agent.agency ? `${agent.name} — ${agent.agency}` : agent.name,
        group: agent.agency ?? undefined,
      })),
    [agents],
  );

  return (
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={t("chooseAgent")}
      searchPlaceholder={t("searchAgent")}
      emptyLabel={t("noAgentFound")}
      searchHint={tSelect("searchHint", { total: agents.length })}
      loadMoreLabel={tSelect("loadMore")}
      required={required}
      className={className}
      pageSize={8}
    />
  );
}
