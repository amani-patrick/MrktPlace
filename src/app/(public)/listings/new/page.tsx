import { NewListingForm } from "@/components/amnii/new-listing-form";
import { getAgentOptions } from "@/lib/data/listings";

export const metadata = {
  title: "List Your Property",
  description: "Post your property on Amnii — free, contact always visible.",
};

export default async function NewListingPage() {
  const agents = await getAgentOptions();

  return (
    <div className="min-h-screen bg-amnii-cream">
      <div className="border-b border-border/60 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="text-sm font-semibold tracking-wide text-amnii-gold uppercase">
            Landlord Portal
          </p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-amnii-navy">
            List Your Property
          </h1>
          <p className="mt-2 text-muted-foreground">
            Free to list. Choose owner-direct or agent-managed. Contact details
            visible immediately.
          </p>
        </div>
      </div>
      <NewListingForm agents={agents} />
    </div>
  );
}
