import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllAdmins } from "@/lib/admin/adminManagment";
import { AdminManager } from "@/components/admin/settings/AdminManager";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/portal-97x-login");

  const admins = await getAllAdmins();
  const currentAdminId = (session.user as { id?: string })?.id;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header  */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
            Paramètres
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            Gestion des comptes administrateurs
          </p>
        </div>
        <div className="text-xs font-medium uppercase tracking-widest text-navy/60 bg-navy/5 border border-navy/10 px-3.5 py-1.5 rounded-full whitespace-nowrap">
          {admins.length} compte{admins.length > 1 ? "s" : ""}
        </div>
      </div>

      <AdminManager
        admins={admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }))}
        currentAdminId={currentAdminId}
      />

    </div>
  );
}