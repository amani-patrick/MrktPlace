import { getTranslations } from "next-intl/server";
import { AgentsDirectory } from "@/components/amnii/agents-directory";
import { getAgents } from "@/lib/data/agents";

export async function generateMetadata() {
  const t = await getTranslations("agents");
  return { title: t("title"), description: t("subtitle") };
}

export default async function AgentsPage() {
  const t = await getTranslations("agents");
  const agents = await getAgents();

  return (
    <div className="bg-amnii-cream min-h-screen">
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl font-bold text-amnii-navy sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AgentsDirectory agents={agents} />
      </div>
    </div>
  );
}
