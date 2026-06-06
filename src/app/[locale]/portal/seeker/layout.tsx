import { PortalShell } from "@/components/portal/portal-shell";
import { PORTAL_CONFIGS } from "@/config/portal";
import {
  getSearchEventCount,
  shouldShowRecentSearchesNav,
} from "@/lib/data/searches";
import { createClient } from "@/lib/supabase/server";

export default async function SeekerPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const searchCount = user ? await getSearchEventCount(user.id) : 0;
  const hideNavHrefs = shouldShowRecentSearchesNav(searchCount)
    ? []
    : ["/portal/seeker/searches"];

  return (
    <PortalShell config={PORTAL_CONFIGS.seeker} hideNavHrefs={hideNavHrefs}>
      {children}
    </PortalShell>
  );
}
