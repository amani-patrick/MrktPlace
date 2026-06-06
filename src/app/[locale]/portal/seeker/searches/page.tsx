import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { buttonVariants } from "@/components/ui/button";

const searches = [
  { query: "2 bed apartment in Remera", filters: "Rent · Gasabo", results: 24 },
  { query: "House for sale Kicukiro", filters: "Buy · Kicukiro", results: 11 },
  { query: "Studio under 350,000", filters: "Rent · Kigali", results: 18 },
];

export const metadata = { title: "Recent Searches" };

export default function SeekerSearchesPage() {
  return (
    <div>
      <PortalPageHeader
        title="Recent searches"
        description="Quickly rerun searches you've used before."
      />

      <div className="space-y-3">
        {searches.map((search) => (
          <div
            key={search.query}
            className="flex flex-col gap-3 rounded-xl border border-border/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{search.query}</p>
              <p className="text-sm text-muted-foreground">
                {search.filters} · {search.results} results
              </p>
            </div>
            <Link href="/search" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Search again
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
