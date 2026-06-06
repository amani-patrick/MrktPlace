import { getTranslations } from "next-intl/server";
import {
  approveListing,
  rejectListing,
} from "@/app/actions/admin";
import { ApproveRejectListing } from "@/components/admin/admin-actions";
import { getAdminListingsForReview } from "@/lib/data/admin";

export const metadata = { title: "Admin — Listings" };

export default async function AdminListingsPage() {
  const t = await getTranslations("admin");
  const listings = await getAdminListingsForReview();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("listingsTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("listingsDesc")}</p>
      </div>

      {listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noPendingListings")}
        </p>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => (
            <div
              key={l.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{l.title}</p>
                <p className="text-sm text-slate-500">
                  {l.sector}, {l.district} · {l.status} · {l.verificationStatus}
                </p>
              </div>
              <ApproveRejectListing
                listingId={l.id}
                approve={approveListing}
                reject={rejectListing}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
