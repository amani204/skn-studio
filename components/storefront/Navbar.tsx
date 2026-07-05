"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Search, ShoppingBag, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs for navbar
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  
  // Refs for mobile menu
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuLogoRef = useRef<HTMLDivElement>(null);

  // ==================== NAVBAR ENTRANCE ANIMATION ====================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        navRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 }
      ).fromTo(
        [
          logoRef.current,
          ...(linksRef.current ? Array.from(linksRef.current.children) : []),
          ...(iconsRef.current ? Array.from(iconsRef.current.children) : []),
        ],
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06 },
        "-=0.5"
      );
    }, navRef);

    return () => ctx.revert();
  }, []);

  // ==================== SCROLL ANIMATION - ONLY WIDTH SHRINKS ====================
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 24;
      gsap.to(nav, {
        paddingTop: scrolled ? "0.4rem" : "0.9rem",
        paddingBottom: scrolled ? "0.4rem" : "0.9rem",
        paddingLeft: scrolled ? "1.5rem" : "2rem",
        paddingRight: scrolled ? "1.5rem" : "2rem",
        // Width shrinks on scroll
        maxWidth: scrolled ? "90%" : "100%",
        // Keep background the same
        backgroundColor: "rgba(246, 244, 240, 0.45)",
        boxShadow: scrolled
          ? "0 8px 30px -12px rgba(24,24,24,0.18)"
          : "0 0px 0px rgba(0,0,0,0)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ==================== UNDERLINE ANIMATION ====================
  const handleEnter = (i: number) => {
    const el = underlineRefs.current[i];
    if (!el) return;
    gsap.fromTo(
      el,
      { scaleX: 0, transformOrigin: "left" },
      { scaleX: 1, duration: 0.35, ease: "power2.out" }
    );
  };

  const handleLeave = (i: number) => {
    const el = underlineRefs.current[i];
    if (!el) return;
    gsap.to(el, { scaleX: 0, transformOrigin: "right", duration: 0.3, ease: "power2.in" });
  };

  // ==================== MOBILE MENU TOGGLE ====================
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // ==================== MOBILE MENU ANIMATION ====================
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });

      gsap.fromTo(
        menuRef.current,
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        menuLogoRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", delay: 0.1 }
      );

      gsap.fromTo(
        mobileLinksRef.current.filter(Boolean),
        { x: 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    } else {
      document.body.style.overflow = "";

      gsap.to(menuRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // ==================== RENDER ====================
  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
        <nav
          ref={navRef}
          className="grid w-full max-w-6xl grid-cols-2 md:grid-cols-3 items-center rounded-lg border border-navy/10 px-4 sm:px-8 py-2 sm:py-[0.9rem] backdrop-blur-md"
          style={{ backgroundColor: "rgba(246, 244, 240, 0.45)" }}
        >
          {/* Logo - Smaller on mobile */}
          <div ref={logoRef} className="justify-self-start">
            <Link
              href="/"
              className="font-display text-sm sm:text-lg uppercase tracking-[0.15em] text-navy"
            >
              SKN Studio
            </Link>
          </div>

          {/* Desktop Links - Hidden on mobile */}
          <div ref={linksRef} className="hidden md:flex items-center justify-center gap-10">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
                className="relative text-sm font-medium tracking-wide text-ink/80 transition-colors hover:text-navy"
              >
                {link.label}
                <span
                  ref={(el) => {
                    underlineRefs.current[i] = el;
                  }}
                  className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-navy"
                />
              </Link>
            ))}
          </div>

          {/* Icons - Right aligned */}
          <div ref={iconsRef} className="flex items-center justify-end gap-3 sm:gap-5">
            <button
              aria-label="Search"
              className="text-ink/80 transition-colors hover:text-navy"
            >
              <Search size={16} strokeWidth={1.6} />
            </button>
            <button
              aria-label="Cart"
              className="text-ink/80 transition-colors hover:text-navy relative"
            >
              <ShoppingBag size={16} strokeWidth={1.6} />
              <span className="absolute -top-1 -right-1.5 h-3 w-3 rounded-full bg-navy text-[8px] flex items-center justify-center text-white">
                0
              </span>
            </button>

            {/* Basic Mobile Menu Toggle - Just the Menu icon */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-ink/80 transition-colors hover:text-navy"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} strokeWidth={1.6} />
              ) : (
                <Menu size={20} strokeWidth={1.6} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ===== MOBILE MENU OVERLAY ===== */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none"
        onClick={closeMobileMenu}
      />

      {/* ===== MOBILE MENU PANEL - Cleaner Style ===== */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 z-50 h-full w-75 sm:w-90 bg-[#F6F4F0] px-8 py-12 shadow-2xl translate-x-full opacity-0"
        style={{ x: "100%", opacity: 0 }}
      >
        {/* Close Button */}
        <button
          onClick={closeMobileMenu}
          className="absolute top-6 right-6 backdrop-blur-sm flex items-center justify-center text-ink/80 transition-all hover:text-navy"
          aria-label="Close menu"
        >
          <X size={18} strokeWidth={1.6} />
        </button>

        {/* Logo - Clean, no decorative lines */}
        <div ref={menuLogoRef} className="mb-12 text-center">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="font-display text-xl uppercase tracking-[0.2em] text-navy"
          >
            SKN Studio
          </Link>
        </div>

        {/* Mobile Links - Clean style */}
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              ref={(el) => {
                mobileLinksRef.current[i] = el;
              }}
              href={link.href}
              onClick={closeMobileMenu}
              className="group relative px-4 py-3 text-sm font-light tracking-wide text-ink/70 transition-all hover:text-navy hover:pl-6"
              style={{ opacity: 0, x: 40 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-sm text-navy/20 group-hover:text-navy/40 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {link.label}
              </span>
              <span className="absolute bottom-2 left-0 h-px w-0 bg-navy/20 group-hover:w-full transition-all duration-500" />
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-8 right-8 flex flex-col items-center gap-1 text-xs text-ink/30 border-t border-ink/10 pt-4">
          <span>© 2026 SKN Studio</span>
          <span className="text-[10px] tracking-widest">By Amani</span>
        </div>
      </div>
    </>
  );
}