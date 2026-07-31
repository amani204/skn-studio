"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";
import type { ShopProduct } from "@/lib/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductGridProps {
  products: ShopProduct[];
}

function ProductCard({ product }: { product: ShopProduct }) {
  const { addItem } = useCart();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const frontImage = product.images[0] ?? "/placeholder.png";
  const backImage = product.images[1] ?? frontImage;
  const hasSecondImage = product.images.length > 1;

  const handleEnter = () => {
    if (!hasSecondImage) return;
    gsap.to(frontRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(backRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
  };

  const handleLeave = () => {
    if (!hasSecondImage) return;
    gsap.to(frontRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(backRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div className="product-card flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-powder/20 block"
      >
        <div ref={frontRef} className="absolute inset-0">
          <Image src={frontImage} alt={product.name} fill className="object-cover" />
        </div>
        {hasSecondImage && (
          <div ref={backRef} className="absolute inset-0 opacity-0">
            <Image
              src={backImage}
              alt={`${product.name}, détail de texture`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2 sm:mt-4 sm:gap-3">
        <div>
          <h3 className="font-display text-sm text-ink sm:text-base">{product.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs text-ink/60 sm:mt-1 sm:text-sm">
            {product.description}
          </p>
        </div>
        <span className="whitespace-nowrap text-xs font-medium text-navy sm:text-sm">
          {product.price.toLocaleString()} DA
        </span>
      </div>

      <button
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: frontImage,
          })
        }
        className="mt-2 self-start border-b border-navy pb-0.5 text-[10px] uppercase tracking-widest text-navy transition-colors hover:border-blue hover:text-blue sm:mt-3 sm:text-xs"
      >
        Ajouter au panier
      </button>
    </div>
  );
}

function getGridClasses(count: number) {
  switch (count) {
    case 1:
      return "grid-cols-1 max-w-[240px]";
    case 2:
      return "grid-cols-2 max-w-xl";
    case 3:
      return "grid-cols-2 sm:grid-cols-3 max-w-4xl";
    default:
      return "grid-cols-2 lg:grid-cols-4 max-w-none";
  }
}

export default function ProductGrid({ products }: ProductGridProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [products.length]);

  return (
    <section id="shop" ref={sectionRef} className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
      {/* Header */}
      <div className="mb-8 text-center sm:mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">Meilleures ventes</p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
          Nos Icônes
        </h2>
        <p className="mt-2 text-sm text-ink/60 sm:mt-3">
          Les formules qui nous ont rendus célèbres.
        </p>
      </div>

      {/* Products Grid — column count adapts to how many are featured, always centered */}
      {products.length === 0 ? (
        <p className="py-12 text-center text-sm text-ink/50">
          Aucun produit en vedette pour le moment.
        </p>
      ) : (
        <div
          className={`mx-auto grid gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-12 ${getGridClasses(
            products.length
          )}`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Voir tout - Underline Link */}
      <div className="mt-10 text-center sm:mt-12">
        <Link
          href="/products"
          className="group relative inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-navy/60 transition-colors hover:text-navy sm:text-sm"
        >
          <span>Voir toute la boutique</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-navy transition-all duration-500 group-hover:w-full" />
        </Link>
      </div>
    </section>
  );
}