"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

type SearchResult = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
};

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ==================== OPEN/CLOSE ====================
  const openSearch = () => {
    setIsOpen(true);
    // Focus after animation completes
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select(); // Select any existing text
    }, 350);
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    // Blur input when closing
    inputRef.current?.blur();
  };

  // ==================== SEARCH ====================
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ==================== GSAP ANIMATION ====================
  useEffect(() => {
    if (isOpen) {
      // Input expands smoothly
      gsap.fromTo(
        inputWrapRef.current,
        { width: 0, opacity: 0 },
        { width: "auto", opacity: 1, duration: 0.35, ease: "power2.out" }
      );

      // Results slide down
      gsap.fromTo(
        resultsRef.current,
        { y: -8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", delay: 0.1 }
      );
    } else {
      gsap.to(inputWrapRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });
      gsap.to(resultsRef.current, {
        y: -8,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  // ==================== KEYBOARD SHORTCUTS ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K to open
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSearch();
      }
      // ESC to close
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ==================== CLICK OUTSIDE ====================
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Search Icon */}
      <button
        onClick={openSearch}
        aria-label="Rechercher"
        className="text-ink/60 transition-colors hover:text-navy"
      >
        <Search size={17} strokeWidth={1.5} />
      </button>

      {/* Search Input - Smooth expand */}
      <div
        ref={inputWrapRef}
        className="overflow-hidden"
        style={{ width: 0, opacity: 0 }}
      >
        <div className="ml-2 flex items-center gap-1.5 rounded-lg border border-powder/20 bg-white/80 px-3 py-1 shadow-sm backdrop-blur-sm ">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-36 bg-transparent py-1 text-xs text-ink placeholder:text-ink/40 focus:ring-none sm:w-48"
            aria-label="Rechercher un produit"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="text-ink/20 transition-colors hover:text-ink/50"
              aria-label="Effacer la recherche"
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim() && (
        <div
          ref={resultsRef}
          className="absolute right-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto rounded-lg border border-powder/20 bg-white/95 shadow-lg backdrop-blur-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-4 text-center text-xs text-ink/40">
              Aucun résultat
            </div>
          ) : (
            <div className="py-1">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-powder/5"
                >
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-powder/20">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[8px] text-ink/20">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs text-ink">{product.name}</p>
                    <p className="text-[10px] text-navy">{product.price.toLocaleString()} DA</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}