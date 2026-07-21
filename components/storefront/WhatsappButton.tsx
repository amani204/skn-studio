"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const WHATSAPP_NUMBER = "213551386587";
const DEFAULT_MESSAGE = "Bonjour SKN Studio, j'ai une question sur vos produits.";

export default function WhatsAppButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 1.2 }
      );

      gsap.to(ringRef.current, {
        scale: 1.8,
        opacity: 0,
        duration: 1.6,
        ease: "power2.out",
        repeat: -1,
        delay: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discutez avec nous sur WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      {/* Pulse ring sits behind the button, same shape, expanding and fading */}
      <span
        ref={ringRef}
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60"
      />

      {/* WhatsApp glyph — inline SVG, no icon-pack dependency */}
      <svg
        viewBox="0 0 32 32"
        fill="white"
        className="relative h-7 w-7"
        aria-hidden="true"
      >
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.678 4.523 1.85 6.362L4 29l7.828-1.82A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 17.02c-.29.816-1.44 1.5-2.36 1.7-.63.13-1.45.24-4.2-.9-3.53-1.46-5.8-5.02-5.98-5.25-.17-.23-1.43-1.9-1.43-3.63 0-1.72.9-2.57 1.22-2.92.32-.35.7-.44.93-.44.23 0 .47 0 .67.01.22.01.51-.08.8.61.29.7.99 2.42 1.08 2.6.09.18.15.39.03.62-.12.23-.18.37-.36.57-.18.2-.38.44-.54.6-.18.18-.37.37-.16.73.21.36.94 1.55 2.02 2.51 1.39 1.24 2.56 1.63 2.92 1.81.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.8-.18.32.12 2.04.96 2.39 1.14.35.18.58.27.66.42.09.15.09.85-.21 1.66Z" />
      </svg>

      {/* Tooltip — appears on hover, desktop only */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs text-cream opacity-0 transition-opacity group-hover:opacity-100 sm:block">
        Besoin d&rsquo;aide ? Écrivez-nous
      </span>
    </a>
  );
}