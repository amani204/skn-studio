import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, MessageCircle, MapPin, Truck } from "lucide-react";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getOrderById } from "@/lib/admin/order";
import { StatusSelect } from "@/components/admin/orders/StatusSelect";
import { orderStatusConfig, type OrderStatusValue } from "@/lib/order-status";

export const dynamic = "force-dynamic";

const DZD = new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 });

function toWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("0") ? digits.slice(1) : digits;
  return `213${local}`;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await requireAdmin();
  if (!session) redirect("/admin/portal-97x-login");

  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.shippingAddress;
  const status = order.status as OrderStatusValue;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header  */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Back link  */}
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-navy transition-colors"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Retour aux commandes
          </Link>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl mt-1">
            Commande #{order.orderNumber.slice(0, 8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            Passée le{" "}
            {new Date(order.createdAt).toLocaleDateString("fr-DZ", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Status select  */}
        <StatusSelect
          orderId={order.id}
          status={status}
          className="self-start sm:self-auto"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Items + notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items card */}
          <div className="rounded-lg border border-powder/40 bg-white p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-widest text-ink/50">
              Articles ({order.items.length})
            </h2>
            <ul className="divide-y divide-powder/20">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-powder/10">
                    {item.product?.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.images[0].url}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{item.productName}</p>
                    <p className="text-xs text-ink/50">
                      {DZD.format(Number(item.price))} DA × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-ink">
                    {DZD.format(Number(item.price) * item.quantity)} DA
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-1 border-t border-powder/20 pt-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Sous-total</span>
                <span>{DZD.format(Number(order.subtotal))} DA</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Livraison</span>
                <span>{DZD.format(Number(order.shippingCost))} DA</span>
              </div>
              <div className="flex justify-between pt-1 font-display text-base text-navy">
                <span>Total</span>
                <span>{DZD.format(Number(order.total))} DA</span>
              </div>
            </div>
          </div>

          {/* Notes card */}
          {order.notes && (
            <div className="rounded-lg border border-powder/40 bg-white p-5">
              <h2 className="mb-2 font-display text-sm uppercase tracking-widest text-ink/50">
                Notes du client
              </h2>
              <p className="text-sm text-ink/70">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right column: Customer & status */}
        <div className="space-y-6">
          {/* Customer card */}
          <div className="rounded-lg border border-powder/40 bg-white p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-widest text-ink/50">
              Client
            </h2>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-ink">{address?.fullName ?? "—"}</p>

              {address?.phone && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${address.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-powder/40 px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-navy/30 hover:text-navy transition-colors"
                  >
                    <Phone size={13} strokeWidth={1.5} />
                    {address.phone}
                  </a>
                  <a
                    href={`https://wa.me/${toWhatsAppNumber(address.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <MessageCircle size={13} strokeWidth={1.5} />
                    WhatsApp
                  </a>
                </div>
              )}

              <div className="flex items-start gap-2 pt-2 text-ink/70">
                <MapPin size={14} strokeWidth={1.5} className="mt-0.5 shrink-0" />
                <div>
                  <p>
                    {address?.wilaya} ({address?.wilayaCode}) — {address?.commune}
                  </p>
                  {address?.address && (
                    <p className="text-xs text-ink/50">{address.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-ink/70">
                <Truck size={14} strokeWidth={1.5} className="shrink-0" />
                <span>
                  {order.deliveryMethod === "HOME"
                    ? "Livraison à domicile"
                    : "Retrait au bureau"}
                </span>
              </div>
            </div>
          </div>

          {/* Status card */}
          <div className="rounded-lg border border-powder/40 bg-white p-5">
            <h2 className="mb-3 font-display text-sm uppercase tracking-widest text-ink/50">
              Statut actuel
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${orderStatusConfig[status].badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${orderStatusConfig[status].dotClass}`}
              />
              {orderStatusConfig[status].label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}