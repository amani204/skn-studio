"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Eye } from "lucide-react";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  imageUrl?: string;
};

export default function ProductCard({
  id,
  slug,
  name,
  price,
  oldPrice,
  imageUrl,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      {/* Image Container */}
      <Link href={`/products/${slug}`} className="block overflow-hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-powder/10">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink/40">
              Pas d'image
            </div>
          )}

          {/* Sale Badge */}
          {oldPrice && (
            <span className="absolute left-3 top-3 z-10 rounded-lg bg-navy/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-navy">
              Promo
            </span>
          )}
         
        </div>
      </Link>

      {/* Content */}
      <div className="mt-3">
        <Link href={`/products/${slug}`}>
          <h3 className="font-display text-sm text-ink">
            {name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-medium text-navy">
            {price.toLocaleString()} DA
          </span>
          {oldPrice && (
            <span className="text-xs text-ink/30 line-through">
              {oldPrice.toLocaleString()} DA
            </span>
          )}
        </div>

        {/* Add to Cart Button - Clean underline style */}
        <button
          onClick={handleAddToCart}
           className="mt-4 self-start border-b border-navy pb-0.5 text-xs uppercase tracking-widest text-navy transition-colors hover:border-blue hover:text-blue"
      >
        Ajouter au panier
        </button>
      </div>
    </div>
  );
}