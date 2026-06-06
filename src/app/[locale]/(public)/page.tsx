import { AmniiFeatures } from "@/components/amnii/features";
import { AmniiHero } from "@/components/amnii/hero";
import { NewListings } from "@/components/amnii/new-listings";
import { SafetyBanner } from "@/components/amnii/safety-banner";
import { UrgentListings } from "@/components/amnii/urgent-listings";
import { getDisplayName } from "@/lib/display-name";
import { getListings } from "@/lib/data/listings";
import { createClient } from "@/lib/supabase/server";
import { pickWelcomeMessageKey } from "@/lib/welcome-message";

export default async function HomePage() {
  const allListings = await getListings();
  const urgentListings = allListings.slice(0, 3);
  const recentListings = allListings.slice(0, 4);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let welcomeKey: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .maybeSingle();

    displayName = getDisplayName(profile?.full_name, user.email);
    welcomeKey = pickWelcomeMessageKey(user.id);
  }

  return (
    <>
      <AmniiHero displayName={displayName} welcomeKey={welcomeKey} />
      <UrgentListings listings={urgentListings} />
      <SafetyBanner />
      <NewListings listings={recentListings} />
      <AmniiFeatures />
    </>
  );
}
