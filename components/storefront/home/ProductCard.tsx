"use client";

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
};

export function ProductCard({ id, slug, name, price, oldPrice, imageUrl }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-lg border border-powder/40 bg-white/50 transition-all hover:border-blue/20 hover:bg-white/80 hover:shadow-sm"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-powder/20">
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
            Pas d&apos;image
          </div>
        )}
        {oldPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-navy/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-navy">
            Promo
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base text-ink">{name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-medium text-navy">{price.toLocaleString()} DA</span>
              {oldPrice && (
                <span className="text-xs text-ink/40 line-through">
                  {oldPrice.toLocaleString()} DA
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault(); // don't navigate to the product page on add-to-cart click
              addItem({ id, name, price, image: imageUrl ?? "" });
            }}
            className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-navy/15 text-navy/40 transition-all hover:border-navy/40 hover:bg-navy hover:text-white hover:shadow-sm"
            aria-label="Ajouter au panier"
          >
            <span className="text-base leading-none">+</span>
          </button>
        </div>
      </div>
    </Link>
  );
}