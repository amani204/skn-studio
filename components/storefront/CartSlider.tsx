"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartSlider() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total, itemCount } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // ==================== CART ANIMATION ====================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      gsap.fromTo(
        panelRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "";

      gsap.to(panelRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm opacity-0 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      {/* Cart Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 z-50 flex h-full w-full translate-x-full flex-col bg-cream opacity-0 shadow-2xl sm:w-105"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-5">
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-navy">
            Panier <span className="text-sm font-light text-ink/40">({itemCount})</span>
          </h2>
          <button
            onClick={closeCart}
            className="rounded-full p-2 text-ink/40 transition-colors  hover:text-navy"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-powder/20 p-6">
                <ShoppingBag size={40} className="text-ink/20" strokeWidth={1} />
              </div>
              <p className="mt-4 text-sm text-ink/40">Votre panier est vide</p>
              <Link
                href="/shop"
                className="mt-6 border-b border-navy/20 pb-0.5 text-sm font-medium uppercase tracking-widest text-navy/60 transition-colors hover:text-navy"
              >
                Continuer vos achats
              </Link>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-navy/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 shrink-0 text-sm text-center overflow-hidden rounded-lg bg-powder/20">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-sm text-ink pb-2">{item.name}</h4>
                    <p className="text-sm font-medium text-navy">{item.price.toLocaleString()} DA</p>

                    {/* Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-navy/10 text-navy/30 transition-colors hover:bg-powder/10 hover:border-navy/30"
                      >
                        <Minus size={12} strokeWidth={2} />
                      </button>
                      <span className="w-6 text-center text-sm font-light text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-navy/10 text-navy/30 transition-colors hover:bg-powder/10 hover:border-navy/30"
                      >
                        <Plus size={12} strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-ink/20 transition-colors hover:text-rose-400"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-navy/10 px-6 py-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-light uppercase tracking-widest text-ink/40">
                Total
              </span>
              <span className="font-display text-xl text-navy">
                {total.toLocaleString()} DA
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-4 block w-full text-center border rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white transition-all hover:bg-navy/80 hover:shadow-md"
            >
              Passer la commande
            </Link>
            <p className="mt-2 text-center text-[10px] text-ink/25">
              Livraison calculée à l'étape suivante
            </p>
          </div>
        )}
      </div>
    </>
  );
}