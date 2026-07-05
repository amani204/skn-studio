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
    quote: "My skin finally calmed down after switching to the Barrier Serum. Three weeks in and the redness is gone.",
    name: "Amara T.",
    tag: "Verified Buyer",
  },
  {
    quote: "I've tried every serum on the market. This is the first one that didn't break me out.",
    name: "Leila K.",
    tag: "Verified Buyer",
  },
  {
    quote: "Simple routine, real results. I don't miss my old ten-step routine at all.",
    name: "Sofia M.",
    tag: "Verified Buyer",
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
    <section ref={sectionRef} className="bg-powder/15 px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-blue">Reviews</p>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Our Customers Say</h2>
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
