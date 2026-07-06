"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MARQUEE_ITEMS = [
  "Livraison gratuite dès 20000 DA",
  "Testé dermatologiquement",
  "Sans cruauté",
  "Réparation de la barrière cutanée en 14 jours",
  "Paiement à la livraison",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -(track.scrollWidth / 2),
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, []);

  const renderItems = (keyPrefix: string) =>
    MARQUEE_ITEMS.map((item, i) => (
      <span
        key={`${keyPrefix}-${i}`}
        className="mx-6 flex items-center gap-6 whitespace-nowrap text-sm uppercase tracking-[0.25em] text-white/80"
      >
        {item}
        <span className="h-1 w-1 rounded-full bg-white/30" />
      </span>
    ));

  return (
    <div className="w-full overflow-hidden bg-navy/95 py-3.5 border-y border-white/5">
      <div ref={trackRef} className="flex w-max">
        {renderItems("a")}
        {renderItems("b")}
      </div>
    </div>
  );
}