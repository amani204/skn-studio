import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildOrderConfirmationLink } from "@/lib/whatsapp";
import WhatsAppConfirmButton from "@/components/storefront/checkout/WhatsAppConfirmButton";
import ClearCartOnMount from "@/components/storefront/checkout/ClearCartOnMount";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true, shippingAddress: true },
  });

  if (!order || !order.shippingAddress) {
    notFound();
  }

  const whatsappLink = buildOrderConfirmationLink({
    orderNumber: order.orderNumber,
    fullName: order.shippingAddress.fullName,
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      price: Number(i.price),
    })),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    wilaya: order.shippingAddress.wilaya,
    deliveryMethod: order.deliveryMethod,
  });

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center sm:px-8 sm:pt-40">
      <ClearCartOnMount />

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-navy/5">
        <span className="text-3xl text-navy">✓</span>
      </div>

      <h1 className="font-display text-3xl text-ink">Commande confirmée</h1>
      <p className="mt-2 text-sm text-ink/60">
        N° de commande : <span className="font-medium text-ink">{order.orderNumber}</span>
      </p>

      <div className="mt-8 rounded-lg border border-powder/40 bg-white/50 p-6 text-left">
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-ink/70">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-ink">{(Number(item.price) * item.quantity).toLocaleString()} DA</span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 border-t border-powder/30 pt-4 text-sm">
          <div className="flex justify-between text-ink/60">
            <span>Sous-total</span>
            <span>{Number(order.subtotal).toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between text-ink/60">
            <span>Livraison ({order.shippingAddress.wilaya})</span>
            <span>{Number(order.shippingCost).toLocaleString()} DA</span>
          </div>
          <div className="flex justify-between border-t border-powder/30 pt-2 text-base font-medium text-ink">
            <span>Total</span>
            <span className="text-navy">{Number(order.total).toLocaleString()} DA</span>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink/60">
        Paiement à la livraison. Confirmez votre commande via WhatsApp pour un traitement plus rapide.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <WhatsAppConfirmButton href={whatsappLink} />
        <Link
          href="/products"
          className="text-sm text-ink/60 underline hover:text-navy"
        >
          Continuer vos achats
        </Link>
      </div>
    </main>
  );
}