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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in the text on scroll
      gsap.fromTo(
        bgTextRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
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
    <section
      ref={sectionRef}
      className="relative flex h-[60vh] items-center justify-center overflow-hidden sm:h-[70vh]"
    >
      {/* Background Text */}
      <h2
        ref={bgTextRef}
        aria-hidden="true"
        className="select-none font-display uppercase text-navy/10"
        style={{ fontSize: "clamp(4rem, 16vw, 14rem)" }}
      >
        SKN Studio
      </h2>
    </section>
  );
}