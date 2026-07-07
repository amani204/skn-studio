"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/products" },
  { label: "À propos", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();

  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const menuLogoRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 24;
      gsap.to(nav, {
        paddingTop: scrolled ? "0.55rem" : "0.9rem",
        paddingBottom: scrolled ? "0.55rem" : "0.9rem",
        backgroundColor: scrolled ? "rgba(246, 244, 240, 0.85)" : "rgba(246, 244, 240, 0.45)",
        boxShadow: scrolled ? "0 8px 30px -12px rgba(24,24,24,0.18)" : "0 0px 0px rgba(0,0,0,0)",
        duration: 0.4,
        ease: "power2.out",
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";

      gsap.to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });

      gsap.fromTo(
        menuRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.6, ease: "power3.out" }
      );

      gsap.fromTo(
        menuLogoRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out", delay: 0.1 }
      );

      gsap.fromTo(
        mobileLinksRef.current.filter(Boolean),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.15 }
      );
    } else {
      document.body.style.overflow = "";

      gsap.to(menuRef.current, { x: "100%", opacity: 0, duration: 0.4, ease: "power2.in" });
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" });
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // ==================== SMOOTH SCROLL ====================
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-4 z-50 flex justify-center px-3 sm:top-6 sm:px-4">
        <nav
          ref={navRef}
          className="grid w-[80%] max-w-6xl grid-cols-2 items-center rounded-lg border border-navy/10 px-4 py-2 backdrop-blur-md sm:px-8 sm:py-[0.9rem] md:grid-cols-3"
          style={{ backgroundColor: "rgba(246, 244, 240, 0.45)" }}
        >
          <div ref={logoRef} className="justify-self-start">
            <Link href="/" className="font-display text-sm uppercase tracking-[0.15em] text-navy sm:text-lg">
              SKN Studio
            </Link>
          </div>

          <div ref={linksRef} className="hidden items-center justify-center gap-10 md:flex">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
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

          <div ref={iconsRef} className="flex items-center justify-end gap-3 sm:gap-5">
            <button aria-label="Rechercher" className="text-ink/80 transition-colors hover:text-navy">
              <Search size={16} strokeWidth={1.6} />
            </button>

            <button
              onClick={toggleCart}
              aria-label="Panier"
              className="relative text-ink/80 transition-colors hover:text-navy"
            >
              <ShoppingBag size={16} strokeWidth={1.6} />
              {itemCount > 0 && (
                <span className="absolute -right-1.5 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-navy text-[8px] text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="text-ink/80 transition-colors hover:text-navy md:hidden"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} strokeWidth={1.6} /> : <Menu size={20} strokeWidth={1.6} />}
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40 opacity-0 backdrop-blur-sm pointer-events-none"
        onClick={closeMobileMenu}
      />

      <div
        ref={menuRef}
        className="fixed top-0 right-0 z-50 h-full w-75 translate-x-full bg-[#F6F4F0] px-8 py-12 opacity-0 shadow-2xl sm:w-90"
      >
        <button
          onClick={closeMobileMenu}
          className="absolute right-6 top-6 flex items-center justify-center text-ink/80 backdrop-blur-sm transition-all hover:text-navy"
          aria-label="Fermer le menu"
        >
          <X size={18} strokeWidth={1.6} />
        </button>

        <div ref={menuLogoRef} className="mb-12 text-center">
          <Link href="/" onClick={closeMobileMenu} className="font-display text-xl uppercase tracking-[0.2em] text-navy">
            SKN Studio
          </Link>
        </div>

        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              ref={(el) => {
                mobileLinksRef.current[i] = el;
              }}
              href={link.href}
              onClick={(e) => {
                handleSmoothScroll(e, link.href);
                closeMobileMenu();
              }}
              className="group relative px-4 py-3 text-sm font-light tracking-wide text-ink/70 transition-all hover:pl-6 hover:text-navy"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="text-sm text-navy/20 transition-colors group-hover:text-navy/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </span>
              <span className="absolute bottom-2 left-0 h-px w-0 bg-navy/20 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-8 right-8 flex flex-col items-center gap-1 border-t border-ink/10 pt-4 text-xs text-ink/30">
          <span>© 2026 SKN Studio</span>
          <span className="text-[10px] tracking-widest">Par Amani</span>
        </div>
      </div>
    </>
  );
}