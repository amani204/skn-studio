"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  imageUrl?: string;
  stock: number; // ← added
};

export default function ProductCard({
  id,
  slug,
  name,
  price,
  oldPrice,
  imageUrl,
  stock,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isSoldOut = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSoldOut) return;
    setIsAdding(true);
    addItem({
      id,
      name,
      price,
      image: imageUrl || "/placeholder.jpg",
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${slug}`} className="block overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-powder/10">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition duration-500 group-hover:scale-105 ${
                isSoldOut ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">
              Pas d&apos;image
            </div>
          )}

          {oldPrice && !isSoldOut && (
            <span className="absolute left-3 top-3 z-10 rounded-lg bg-navy/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-navy">
              Promo
            </span>
          )}
          {isSoldOut && (
            <span className="absolute left-3 top-3 z-10 rounded-lg bg-ink/70 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
              Rupture de stock
            </span>
          )}
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/products/${slug}`}>
          <h3 className="font-display text-sm text-ink">{name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-navy">{price.toLocaleString()} DA</span>
          {oldPrice && (
            <span className="text-xs text-ink/30 line-through">
              {oldPrice.toLocaleString()} DA
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isSoldOut}
          className={`mt-4 self-start border-b pb-0.5 text-xs uppercase tracking-widest transition-colors ${
            isSoldOut
              ? "cursor-not-allowed border-ink/20 text-ink/30"
              : "border-navy text-navy hover:border-blue hover:text-blue"
          }`}
        >
          {isSoldOut ? "Rupture de stock" : isAdding ? "Ajouté ✓" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}