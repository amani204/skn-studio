"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { ShopProduct } from "@/lib/products";

export default function AddToCartButton({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const isSoldOut = product.stock <= 0;

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  function handleAddToCart() {
    if (isSoldOut) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] ?? "",
      },
      quantity
    );
    setQuantity(1); 
  }

  return (
    <div className="mt-6 flex items-center gap-4">
      {!isSoldOut && (
        <div className="flex items-center gap-3 rounded-full border border-navy/15 px-3 py-2">
          <button
            type="button"
            onClick={decrement}
            disabled={quantity <= 1}
            className="text-navy/50 transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Diminuer la quantité"
          >
            <Minus size={14} strokeWidth={2} />
          </button>
          <span className="w-4 text-center text-sm text-ink">{quantity}</span>
          <button
            type="button"
            onClick={increment}
            disabled={quantity >= product.stock}
            className="text-navy/50 transition-colors hover:text-navy disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Augmenter la quantité"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      <button
  disabled={isSoldOut}
  onClick={handleAddToCart}
  className={`flex-1 px-6 py-3 text-sm uppercase tracking-widest transition-all ${
    isSoldOut
      ? "cursor-not-allowed rounded-lg bg-ink/10 text-ink/30"
      : "rounded-lg bg-navy text-white hover:bg-navy/80 hover:shadow-md"
  }`}
>
  {isSoldOut ? "Rupture de stock" : "Ajouter au panier"}
</button>
    </div>
  );
}