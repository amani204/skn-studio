"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ==================== ENTRANCE ANIMATION ====================
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
          cardRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ==================== FLOATING CARD ANIMATION - SLOWER ====================
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
    <section ref={sectionRef} className="relative w-full pb-32 pt-0">
      {/* Image Container - Full Width */}
      <div
        ref={imageWrapRef}
        className="relative h-[85vh] w-full overflow-hidden sm:h-[90vh]"
      >
        <Image
          src="/"
          alt="SKN Studio skincare"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* ===== CONTENT OVERLAY ===== */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          {/* Main Title - SKN STUDIO */}
          <h1
            ref={titleRef}
            className="font-display uppercase leading-none tracking-[0.08em] text-white"
            style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
          >
            SKN STUDIO
          </h1>

          {/* Subtitle - Pure. Simple. Skin. */}
          <p
            ref={subtitleRef}
            className="mt-3 max-w-md text-xs uppercase tracking-[0.3em] text-white/70 sm:text-sm"
          >
            Pure. Simple. Skin.
          </p>

          {/* Description - Categories as a descriptive paragraph */}
          <p
            ref={descriptionRef}
            className="mt-6 max-w-2xl text-xs font-light leading-relaxed text-white/50 sm:text-sm"
          >
            Curated skincare essentials — from gentle cleansers to nourishing serums, 
            hair & body care, and thoughtful accessories. Discover clean beauty 
            rooted in simplicity.
          </p>
        </div>

        {/* Product Spotlight Card - Floating */}
        <div className="absolute bottom-15 right-8 z-10">
          <div
            ref={cardRef}
            className="w-64 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-5 shadow-xl"
          >
            <p className="text-[10px] font-body uppercase tracking-[0.2em] text-white/60">
              Featured
            </p>
            <h3 className="mt-1 font-display text-lg text-white">The SKN Serum</h3>
            <p className="mt-1 text-xs text-white/60">
              Three active ingredients. Calmer skin in 14 days.
            </p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-xs font-medium text-white/80 transition-colors hover:text-white"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}