"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance
      gsap.fromTo(
        bgTextRef.current,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        textRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" },
        }
      );
      gsap.fromTo(
        imageRef.current,
        { y: 60, opacity: 0, scale: 1.05 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" },
        }
      );

      // Slow parallax drift
      gsap.to(bgTextRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section  ref={sectionRef} className="relative overflow-hidden py-16 sm:py-20">
      <h2
        ref={bgTextRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center whitespace-nowrap font-display uppercase text-navy/10"
        style={{ fontSize: "clamp(4rem, 16vw, 14rem)" }}
      >
        SKN Studio
      </h2>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 sm:px-8 md:grid-cols-2">
        <div ref={textRef}>
          <p className="text-xs uppercase tracking-[0.3em] text-blue">Notre Philosophie</p>
          <p className="mt-4 max-w-md font-body text-lg leading-relaxed text-ink">
            Nous croyons que les soins de la peau devraient être honnêtes — 
            moins d'ingrédients, clairement étiquetés, formulés pour faire 
            exactement ce qu'ils promettent. Pas de routines en douze étapes, 
            pas d'actifs inutiles. Juste ce dont votre peau a réellement besoin.
          </p>
        </div>

        <div
          ref={imageRef}
          className="relative h-80 w-full overflow-hidden rounded-lg sm:h-105 md:w-[90%] md:justify-self-end"
        >
          <Image src="/about-texture.jpg" alt="Formulation SKN Studio, détail" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
}