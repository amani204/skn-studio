"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PRODUCTS = [
  {
    id: "barrier-serum",
    name: "Le Sérum Barrière",
    price: "4000 DA",
    description: "Calme les rougeurs et renforce la barrière cutanée.",
    imageFront: "/products/serum-front.jpg",
    imageBack: "/products/serum-texture.jpg",
  },
  {
    id: "cloud-cleanser",
    name: "Nettoyant Nuage",
    price: "3500 DA",
    description: "Un nettoyant gel-lait qui n'agresse jamais.",
    imageFront: "/products/cleanser-front.jpg",
    imageBack: "/products/cleanser-texture.jpg",
  },
  {
    id: "daily-barrier-cream",
    name: "Crème Barrière Quotidienne",
    price: "1500 DA",
    description: "Une hydratation légère qui dure toute la journée.",
    imageFront: "/products/cream-front.jpg",
    imageBack: "/products/cream-texture.jpg",
  },
  {
    id: "overnight-renewal-oil",
    name: "Huile de Renouveau Nocturne",
    price: "2500 DA",
    description: "Un mélange nourrissant qui répare pendant votre sommeil.",
    imageFront: "/products/oil-front.jpg",
    imageBack: "/products/oil-texture.jpg",
  },
];

function ProductCard({ product }: { product: (typeof PRODUCTS)[number] }) {
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
        className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-powder/20"
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
        <span className="whitespace-nowrap text-sm font-medium text-navy">{product.price}</span>
      </div>

      <button className="mt-4 self-start border-b border-navy pb-0.5 text-xs uppercase tracking-widest text-navy transition-colors hover:border-blue hover:text-blue cursor-pointer">
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
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">Meilleures ventes</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Nos Icônes</h2>
        <p className="mt-3 text-sm text-ink/60">Les quatre formules qui nous ont rendus célèbres.</p>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Shop Now Button - Centered */}
      <div className="mt-12 text-center">
        <Link
  href="/shop"
  className="inline-block text-sm font-medium uppercase tracking-widest text-navy/60 transition-colors hover:text-navy hover:underline underline-offset-4"
>
  Voir tous les produits →
</Link>
      </div>
    </section>
  );
}