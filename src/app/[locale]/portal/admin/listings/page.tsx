import { Check, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getListings } from "@/lib/data/listings";
import { cn } from "@/lib/utils";

export const metadata = { title: "Admin — Listings" };

export default async function AdminListingsPage() {
  const listings = await getListings({ limit: 6 });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">Listing review</h1>
        <p className="mt-1 text-sm text-slate-500">
          Approve, reject, or verify listings before they reach seekers.
        </p>
      </div>

      <div className="space-y-3">
        {listings.map((l) => (
          <div
            key={l.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-slate-900">{l.title}</p>
              <p className="text-sm text-slate-500">
                {l.sector}, {l.district} · {l.verificationStatus}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "gap-1 bg-emerald-600 text-white hover:bg-emerald-700",
                )}
              >
                <Check className="size-4" /> Approve
              </button>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "gap-1 border-red-200 text-red-600 hover:bg-red-50",
                )}
              >
                <X className="size-4" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
