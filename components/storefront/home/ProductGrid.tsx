"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Prices in DA — matches the currency used in the cart panel, so totals
// add up correctly once these flow into CartContext.
const PRODUCTS = [
  {
    id: "barrier-serum",
    name: "Le Sérum Barrière",
    price: 8000,
    description: "Calme les rougeurs et renforce la barrière cutanée.",
    imageFront: "/products/serum-front.jpg",
    imageBack: "/products/serum-texture.jpg",
  },
  {
    id: "cloud-cleanser",
    name: "Nettoyant Nuage",
    price: 4500,
    description: "Un nettoyant gel-lait qui n'agresse jamais.",
    imageFront: "/products/cleanser-front.jpg",
    imageBack: "/products/cleanser-texture.jpg",
  },
  {
    id: "daily-barrier-cream",
    name: "Crème Barrière Quotidienne",
    price: 6200,
    description: "Une hydratation légère qui dure toute la journée.",
    imageFront: "/products/cream-front.jpg",
    imageBack: "/products/cream-texture.jpg",
  },
  {
    id: "overnight-renewal-oil",
    name: "Huile de Renouveau Nocturne",
    price: 8800,
    description: "Un mélange nourrissant qui répare pendant votre sommeil.",
    imageFront: "/products/oil-front.jpg",
    imageBack: "/products/oil-texture.jpg",
  },
];

function ProductCard({ product }: { product: (typeof PRODUCTS)[number] }) {
  const { addItem } = useCart();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    gsap.to(frontRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.to(backRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
  };

  const handleLeave = () => {
    gsap.to(frontRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.to(backRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
  };

  return (
    <div className="product-card flex flex-col">
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-powder/20"
      >
        <div ref={frontRef} className="absolute inset-0">
          <Image src={product.imageFront} alt={product.name} fill className="object-cover" />
        </div>
        <div ref={backRef} className="absolute inset-0 opacity-0">
          <Image src={product.imageBack} alt={`${product.name}, détail de texture`} fill className="object-cover" />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base text-ink">{product.name}</h3>
          <p className="mt-1 text-sm text-ink/60">{product.description}</p>
        </div>
        <span className="whitespace-nowrap text-sm font-medium text-navy">
          {product.price.toLocaleString()} DA
        </span>
      </div>

      <button
        onClick={() =>
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.imageFront,
          })
        }
        className="mt-4 self-start border-b border-navy pb-0.5 text-xs uppercase tracking-widest text-navy transition-colors hover:border-blue hover:text-blue"
      >
        Ajouter au panier
      </button>
    </div>
  );
}

export default function ProductGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section id="shop" ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">Meilleures ventes</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Nos Icônes</h2>
        <p className="mt-3 text-sm text-ink/60">Les quatre formules qui nous ont rendus célèbres.</p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Voir tout - Underline Link */}
      <div className="mt-12 text-center">
        <Link
          href="/shop"
          className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-navy/60 transition-colors hover:text-navy"
        >
          <span>Voir toute la boutique</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-navy transition-all duration-500 group-hover:w-full" />
        </Link>
      </div>
    </section>
  );
}