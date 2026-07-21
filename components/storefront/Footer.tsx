"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="border-t border-navy/10 py-12"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-sm uppercase tracking-[0.15em] text-navy"
        >
          SKN Studio
        </Link>

        {/* Links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink/40">
          <Link href="#/" className="hover:text-navy transition-colors">
            Accueil
          </Link>
          <Link href="/shop" className="hover:text-navy transition-colors">
            Boutique
          </Link>
          <Link href="/#about" className="hover:text-navy transition-colors">
            À propos
          </Link>
          <Link href="/#contact" className="hover:text-navy transition-colors">
            Contact
          </Link>
        </div>

        {/* Bottom */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[10px] text-ink/25">
          <span>© {new Date().getFullYear()} SKN Studio by  <a
            href="https://www.instagram.com/amani.dev/"  
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-navy transition-colors"
          >
            AMANI
          </a> </span>
          <span className="hidden sm:inline">·</span>
        </div>
      </div>
    </footer>
  );
}