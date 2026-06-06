import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const reports = [
  { id: "r1", listing: "Kimironko Room", reason: "Scam — asked for deposit before visit", status: "open" },
  { id: "r2", listing: "Office Nyamirambo", reason: "Duplicate listing", status: "open" },
  { id: "r3", listing: "Kacyiru Studio", reason: "Wrong price / bait-and-switch", status: "reviewing" },
];

export const metadata = { title: "Admin — Reports" };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">Fraud reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          3+ reports on one listing auto-hide it and land here for review.
        </p>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{r.listing}</p>
                <p className="mt-1 text-sm text-slate-600">{r.reason}</p>
                <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 capitalize">
                  {r.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={cn(buttonVariants({ size: "sm" }), "bg-slate-900 text-white")}
                >
                  Suspend listing
                </button>
                <button type="button" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
