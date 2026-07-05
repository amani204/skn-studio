"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TESTIMONIALS = [
  {
    quote: "Ma peau s'est enfin apaisée après avoir utilisé le Sérum Barrière. Trois semaines plus tard, les rougeurs ont disparu.",
    name: "Amara T.",
    tag: "Achat vérifié",
  },
  {
    quote: "J'ai essayé tous les sérums du marché. C'est le premier qui ne m'a pas provoqué d'éruptions.",
    name: "Leila K.",
    tag: "Achat vérifié",
  },
  {
    quote: "Une routine simple, des résultats réels. Mon ancienne routine en dix étapes ne me manque pas du tout.",
    name: "Sofia M.",
    tag: "Achat vérifié",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
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
    <section id="reviews" ref={sectionRef} className="bg-powder/15 px-4 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue">Avis</p>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Ce que nos clientes disent</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="testimonial-card rounded-lg border border-powder/40 bg-white p-6">
              <div className="flex gap-1 text-navy">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-xs uppercase tracking-widest text-ink/50">
                {t.name} · {t.tag}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}