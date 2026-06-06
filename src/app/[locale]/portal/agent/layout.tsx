import { PortalShell } from "@/components/portal/portal-shell";
import { PORTAL_CONFIGS } from "@/config/portal";

export default function AgentPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell config={PORTAL_CONFIGS.agent}>{children}</PortalShell>;
}
