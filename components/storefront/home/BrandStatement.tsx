"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background text: subtle scale + fade on scroll
      gsap.fromTo(
        bgTextRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Foreground content staggers in
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll("[data-animate]");
        gsap.fromTo(
          elements,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Decorative line grows downward
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[80vh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Text */}
      <h2
        ref={bgTextRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-6xl font-medium italic uppercase leading-none text-navy/[0.04]"
        style={{ fontSize: "clamp(4rem, 18vw, 16rem)" }}
      >
        SKN Studio
      </h2>

      {/* Foreground Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-2xl px-6 text-center"
      >
        <span
          data-animate
          className="mb-8 block text-[10px] uppercase tracking-[0.3em] text-blue "
        >
          Notre Manifeste
        </span>
        <h1
          data-animate
          className="mb-12 font-display text-ink text-4xl leading-[1.1] italic md:text-6xl"
        >
          Là où la précision clinique rencontre{" "}
          <span className="text-slate-muted">
            l'art du rituel intentionnel.
          </span>
        </h1>

        <div className="flex flex-col items-center justify-center gap-12 md:flex-row">
          <p
            data-animate
            className="max-w-[280px] text-left text-sm leading-relaxed text-navy/70"
          >
            Nous croyons que la peau est une toile de l'histoire de chacun. 
            Notre approche traite chaque couche avec la révérence d'une œuvre d'art.
          </p>
          <div
            data-animate
            className="hidden h-px w-12 bg-navy/20 md:block"
          />
          <p
            data-animate
            className="max-w-[280px] text-left text-sm leading-relaxed text-navy/70"
          >
            Formulé en petites séries avec des botaniques pressées à froid et 
            des actifs bio-identiques pour une résonance cellulaire inégalée.
          </p>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4">
        <div
          ref={lineRef}
          className="h-16 w-px origin-top bg-navy/20"
        />
      </div>
    </section>
  );
}