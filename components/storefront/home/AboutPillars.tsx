"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    id: "ingredients",
    label: "Ingrédients",
    image: "/img1.jpg",
    description:
      "Cinq ingrédients actifs maximum par formule, chacun soutenu par la recherche clinique. Pas de charges, pas de parfum, pas de complications.",
  },
  {
    id: "process",
    label: "Processus",
    image: "/skn.png",
    description:
      "Chaque formule est développée avec des dermatologues et testée sur de vraies peaux, pas seulement en laboratoire, avant d'arriver dans nos rayons.",
  },
  {
    id: "promise",
    label: "Promesse",
    image: "/formula.jpg",
    description:
      "Si cela ne fonctionne pas pour votre peau, nous vous remboursons. Sans formulaires, sans conditions — c'est la garantie SKN Studio.",
  },
];

function PillarCard({ pillar }: { pillar: (typeof PILLARS)[number] }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(labelRef.current, { y: -8, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(
      descRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, delay: 0.05, ease: "power2.out" }
    );
  };

  const handleLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in" });
    gsap.to(labelRef.current, { y: 0, duration: 0.35, ease: "power2.in" });
    gsap.to(descRef.current, { y: 16, opacity: 0, duration: 0.3, ease: "power2.in" });
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="pillar-card relative h-105 w-full overflow-hidden rounded-lg"
    >
      <Image src={pillar.image} alt={pillar.label} fill className="object-cover" />

      {/* Base label — always visible */}
      <div className="absolute inset-0 flex items-end p-6">
        <span ref={labelRef} className="font-display text-2xl uppercase  tracking-wide text-ink ">
          {pillar.label}
        </span>
      </div>

      {/* Hover overlay with the description */}
      <div ref={overlayRef} className="absolute inset-0 flex items-end bg-cream/90 p-6 opacity-0">
        <p ref={descRef} className="text-sm leading-relaxed text-ink/90">
          {pillar.description}
        </p>
      </div>
    </div>
  );
}

export default function AboutPillars() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pillar-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
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
    <section id="about" ref={sectionRef} className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
      <div className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-blue">À propos</p>
        <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Ce qui se cache dans SKN Studio
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PILLARS.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
    </section>
  );
}