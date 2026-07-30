"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import Marquee from "./Marquee";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  // ENTRANCE ANIMATION 
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        imageWrapRef.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4 }
      )
        .fromTo(
          titleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.9"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.6"
        )
        .fromTo(
          descriptionRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          cardRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // FLOATING CARD ANIMATION 
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        y: -5,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className="relative w-full pb-16 pt-0 sm:pb-20">
      {/* Image Container - Responsive height tuning */}
      <div
        ref={imageWrapRef}
        className="relative h-[65vh] min-h-[480px] w-full overflow-hidden sm:h-[90vh]"
      >
        <Image
          src="/Hero.png"
          alt="SKN Studio soins de la peau"
          fill
          priority
          /* Anchors image focal point on mobile, centers on desktop */
          className="object-cover object-[65%_25%] sm:object-center"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/30" />

        {/* ===== CONTENT OVERLAY ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {/* Main Title - SKN STUDIO */}
          <h1
            ref={titleRef}
            className="font-display uppercase leading-none tracking-[0.08em] text-white"
            style={{ fontSize: "clamp(2.8rem, 10vw, 8rem)" }}
          >
            SKN STUDIO
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-3 max-w-md text-xs uppercase tracking-[0.3em] text-white/80 sm:text-sm"
          >
            Pur. Simple. Peau.
          </p>

          {/* Description */}
          <p
            ref={descriptionRef}
            className="mt-4 max-w-xl text-xs font-light leading-relaxed text-white/70 sm:mt-6 sm:max-w-2xl sm:text-sm"
          >
            Des essentiels de soin soigneusement sélectionnés — des nettoyants doux 
            aux sérums nourrissants, en passant par les soins du corps et des 
            accessoires. Découvrez une beauté propre ancrée dans la simplicité.
          </p>
          
        {/* Call To Action Buttons */}
          <div
            ref={ctaRef}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
          >
            {/* Primary Action Button */}
            <Link
              href="/products"
              className="group relative flex h-12 w-full min-w-50 items-center justify-center overflow-hidden rounded-lg bg-white px-8 text-xs font-medium uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-neutral-200 hover:shadow-lg sm:w-auto"
            >
              Découvrir la collection
            </Link>

            {/* Secondary Action Button */}
            <Link
              href="#hist"
              className="flex h-12 w-full min-w-40 items-center justify-center rounded-lg border border-white/40 bg-white/5 px-8 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 sm:w-auto"
            >
              Notre Histoire
            </Link>
          </div>
        </div>

        {/* Product Spotlight Card - Hidden on very small screens or responsive positioning */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 sm:bottom-15 sm:right-8 sm:left-auto sm:translate-x-0">
          <div
            ref={cardRef}
            className="w-[calc(100vw-3rem)] max-w-xs rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-4 shadow-xl sm:w-64 sm:p-5"
          >
            <p className="text-[10px] font-body uppercase tracking-[0.2em] text-white/70">
              À l'honneur
            </p>
            <h3 className="mt-0.5 font-display text-base text-white sm:text-lg">Le Sérum SKN</h3>
            <p className="mt-1 text-[11px] text-white/70 sm:text-xs">
              Trois ingrédients actifs. Une peau plus calme en 14 jours.
            </p>
            <Link
              href="/products"
              className="mt-2 inline-block text-xs font-medium text-white/90 transition-colors hover:text-white sm:mt-3"
            >
              Acheter →
            </Link>
          </div>
        </div>
      </div>
      <Marquee />
    </section>
  );
}