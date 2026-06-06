import { AmniiFeatures } from "@/components/amnii/features";
import { AmniiHero } from "@/components/amnii/hero";
import { NewListings } from "@/components/amnii/new-listings";
import { SafetyBanner } from "@/components/amnii/safety-banner";
import { UrgentListings } from "@/components/amnii/urgent-listings";
import { getListings } from "@/lib/data/listings";

export default async function HomePage() {
  const allListings = await getListings();
  const urgentListings = allListings.slice(0, 3);
  const recentListings = allListings.slice(0, 4);

  return (
    <>
      <AmniiHero />
      <UrgentListings listings={urgentListings} />
      <SafetyBanner />
      <NewListings listings={recentListings} />
      <AmniiFeatures />
    </>
  );
}
