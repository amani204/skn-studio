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
  params: Promise<{ id: string }>  // ← Promise
}) {
  const { id } = await params      // ← await

  const session = await requireAdmin();
  if (!session) redirect("/admin/portal-97x-login");

  const order = await getOrderById(id);  // ← use id directly
  if (!order) notFound();

  const address = order.shippingAddress;
  const status = order.status as OrderStatusValue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-navy"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Retour aux commandes
          </Link>
          <h1 className="font-display text-xl text-navy sm:text-2xl">
            Commande #{order.orderNumber.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-ink/50">
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

        <StatusSelect orderId={order.id} status={status} className="self-start sm:self-auto" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items + totals */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-powder/30 bg-white p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-wide text-ink/50">
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

          {order.notes && (
            <div className="rounded-xl border border-powder/30 bg-white p-5">
              <h2 className="mb-2 font-display text-sm uppercase tracking-wide text-ink/50">
                Notes du client
              </h2>
              <p className="text-sm text-ink/70">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Customer / delivery / status */}
        <div className="space-y-4">
          <div className="rounded-xl border border-powder/30 bg-white p-5">
            <h2 className="mb-4 font-display text-sm uppercase tracking-wide text-ink/50">
              Client
            </h2>
            <div className="space-y-3 text-sm">
              <p className="font-medium text-ink">{address?.fullName ?? "—"}</p>

              {address?.phone && (
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${address.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-powder/30 px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-navy/30 hover:text-navy"
                  >
                    <Phone size={13} strokeWidth={1.5} />
                    {address.phone}
                  </a>
                  <a
                    href={`https://wa.me/${toWhatsAppNumber(address.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
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

          <div className="rounded-xl border border-powder/30 bg-white p-5">
            <h2 className="mb-3 font-display text-sm uppercase tracking-wide text-ink/50">
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