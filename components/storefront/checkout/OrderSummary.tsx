"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { Truck } from "lucide-react";

export default function OrderSummary({ shippingCost }: { shippingCost: number }) {
  const { items, total } = useCart();
  const grandTotal = total + shippingCost;

  return (
    <div className="rounded-lg border border-powder/40 bg-white/50 p-4">
      <h2 className="mb-3 font-display text-base text-ink">Résumé de la commande</h2>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-powder/20">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-ink">{item.name}</p>
              <p className="text-[10px] text-ink/40">Qté : {item.quantity}</p>
            </div>
            <span className="whitespace-nowrap text-xs font-medium text-navy">
              {(item.price * item.quantity).toLocaleString()} DA
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-powder/30 pt-3 text-sm">
        <div className="flex justify-between text-ink/60">
          <span className="text-xs">Sous-total</span>
          <span className="text-xs">{total.toLocaleString()} DA</span>
        </div>
        <div className="flex justify-between text-ink/60">
          <span className="text-xs">Livraison</span>
          <span className="text-xs">{shippingCost > 0 ? `${shippingCost.toLocaleString()} DA` : "—"}</span>
        </div>
        <div className="flex justify-between border-t border-powder/30 pt-2">
          <span className="text-sm font-medium text-ink">Total</span>
          <span className="text-base font-medium text-navy">{grandTotal.toLocaleString()} DA</span>
        </div>
      </div>

      {/* Payment at the bottom */}
      <div className="mt-3 flex items-center gap-2 rounded-md bg-powder/10 px-3 py-1.5 text-xs text-ink/40">
        <Truck size={12} strokeWidth={1.5} />
        <span>Paiement à la livraison</span>
      </div>
    </div>
  );
}