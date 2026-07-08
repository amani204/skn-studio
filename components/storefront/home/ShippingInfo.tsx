"use client";

import { useEffect, useRef } from "react";
import { MapPin, Truck, CreditCard } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ShippingInfo() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
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

  const features = [
    {
      icon: MapPin,
      title: "69 Wilayas",
      description: "Livraison partout en Algérie",
    },
    {
      icon: Truck,
      title: "24–48h",
      description: "Expédition rapide via Yalidine",
    },
    {
      icon: CreditCard,
      title: "Cash on Delivery",
      description: "Paiement à la livraison",
    },
  ];

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
      {/* Header - Matching Product Grid */}
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">Livraison</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Livraison partout en Algérie
        </h2>
        <p className="mt-3 text-sm text-ink/60 max-w-2xl mx-auto">
          Nous livrons exclusivement à travers les 69 wilayas d'Algérie. 
          Paiement à la livraison disponible partout.
        </p>
      </div>

      {/* Cards Grid - Matching Product Grid */}
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative rounded-lg border border-powder/40 bg-white/50 p-8 text-center transition-all hover:border-blue/20 hover:bg-white/80 hover:shadow-sm"
            >
              {/* Number - Now on the LEFT */}
              <span className="absolute left-4 top-4 text-sm font-light text-navy/10 select-none">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 transition-colors group-hover:bg-navy/10">
                <Icon size={22} className="text-navy/60 transition-colors group-hover:text-navy" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg text-ink">
                {feature.title}
              </h3>
              <p className="mt-1 text-sm text-ink/50">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}