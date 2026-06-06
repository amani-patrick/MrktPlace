import { PortalShell } from "@/components/portal/portal-shell";
import { PORTAL_CONFIGS } from "@/config/portal";

export default function SeekerPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell config={PORTAL_CONFIGS.seeker}>{children}</PortalShell>;
}
