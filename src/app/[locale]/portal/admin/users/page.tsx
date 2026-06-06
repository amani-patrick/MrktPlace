import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const users = [
  { email: "suspect1@mail.com", reports: 4, listings: 12, status: "flagged" },
  { email: "owner-demo@mail.com", reports: 0, listings: 2, status: "active" },
];

export const metadata = { title: "Admin — Users" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">User management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Suspend accounts that receive repeated fraud reports. They cannot list or contact.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Reports</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Listings</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.email}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{u.email}</p>
                  <span className="text-xs capitalize text-slate-500">{u.status}</span>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">{u.reports}</td>
                <td className="hidden px-4 py-3 md:table-cell">{u.listings}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "border-red-200 text-red-600 hover:bg-red-50",
                    )}
                  >
                    Ban user
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
