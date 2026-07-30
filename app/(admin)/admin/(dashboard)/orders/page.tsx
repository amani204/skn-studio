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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl text-navy sm:text-2xl">Commandes</h1>
        <p className="text-sm text-ink/50">
          {orders.length} commande{orders.length > 1 ? "s" : ""} au total
        </p>
      </div>
     <OrderTable orders={orders} />
    </div>
  );
}