"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Sparkles } from "lucide-react";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Pinterest", href: "#" },
  { label: "TikTok", href: "#" },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ==================== FOOTER ENTRANCE ANIMATION ====================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      // Stagger content entrance
      if (contentRef.current) {
        const children = contentRef.current.children;
        gsap.fromTo(
          children,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3,
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="mt-20 border-t border-navy/10 bg-[#F6F4F0]/50 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 gap-10 text-center sm:text-left sm:grid-cols-3"
        >
          {/* Brand */}
          <div className="space-y-3 flex flex-col items-center sm:items-start">
            <Link
              href="/"
              className="font-display text-base sm:text-sm uppercase tracking-[0.15em] text-navy hover:text-navy/70 transition-colors"
            >
              SKN Studio
            </Link>
            <p className="text-xs text-ink/40 leading-relaxed max-w-xs">
              Curated skincare essentials for your daily ritual.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Sparkles size={12} className="text-navy/20" />
              <span className="text-[10px] tracking-widest text-ink/30">
                EST. 2026
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-ink/50 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-center sm:text-left">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/60 transition-colors hover:text-navy hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-medium uppercase tracking-[0.12em] text-ink/50 mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5 text-center sm:text-left">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink/60 transition-colors hover:text-navy hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="mt-10 flex items-center justify-center gap-4 sm:justify-start">
          <div className="h-px flex-1 max-w-12 bg-navy/10" />
          <Sparkles size={14} className="text-navy/20 flex-shrink-0" />
          <div className="h-px flex-1 max-w-12 bg-navy/10" />
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="text-[10px] tracking-widest text-ink/30 text-center sm:text-left">
            © 2026 SKN Studio. <span className="text-ink/20">By Amani</span>
          </span>
          <span className="text-[10px] tracking-widest text-ink/20 text-center">
            Pure. Simple. Skin.
          </span>
        </div>
      </div>
    </footer>
  );
}