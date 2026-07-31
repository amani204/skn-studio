import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllOrders } from "@/lib/admin/order";
import { OrderTable } from "@/components/admin/orders/OrderTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/portal-97x-login");

  const orders = await getAllOrders();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
            Commandes
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            {orders.length} commande{orders.length > 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      <OrderTable orders={orders} />
    </div>
  );
}