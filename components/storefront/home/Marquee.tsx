"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MARQUEE_ITEMS = [
  "Free shipping over $75",
  "Dermatologist-tested",
  "Cruelty-free",
  "14-day barrier repair",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Track renders the item list twice back-to-back (see JSX below),
    // so animating exactly half its scroll width loops seamlessly.
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -(track.scrollWidth / 2),
        duration: 24,
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
        className="mx-6 flex items-center gap-6 whitespace-nowrap text-sm uppercase tracking-[0.25em] text-cream"
      >
        {item}
        <span className="h-1 w-1 rounded-full bg-cream/50" />
      </span>
    ));

  return (
    <div className="w-full overflow-hidden bg-navy py-3">
      <div ref={trackRef} className="flex w-max">
        {renderItems("a")}
        {renderItems("b")}
      </div>
    </div>
  );
}
