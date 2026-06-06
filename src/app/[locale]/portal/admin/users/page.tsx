import { getTranslations } from "next-intl/server";
import { suspendUser, unsuspendUser } from "@/app/actions/admin";
import { UserSuspendButton } from "@/components/admin/admin-actions";
import { getAdminUsers } from "@/lib/data/admin";

export const metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const t = await getTranslations("admin");
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold text-slate-900">{t("usersTitle")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("usersDesc")}</p>
      </div>

      {users.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("noUsers")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">{t("userColumn")}</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">{t("roleColumn")}</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">{t("listingsColumn")}</th>
                <th className="px-4 py-3 font-medium">{t("actionColumn")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">
                      {u.fullName ?? u.email ?? u.id.slice(0, 8)}
                    </p>
                    {u.email ? (
                      <p className="text-xs text-slate-500">{u.email}</p>
                    ) : null}
                    <span className="text-xs capitalize text-slate-500">
                      {u.isSuspended ? t("suspended") : t("active")}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 capitalize sm:table-cell">{u.role}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{u.listingCount}</td>
                  <td className="px-4 py-3">
                    <UserSuspendButton
                      userId={u.id}
                      isSuspended={u.isSuspended}
                      suspend={suspendUser}
                      unsuspend={unsuspendUser}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
