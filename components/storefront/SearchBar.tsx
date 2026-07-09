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
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ==================== OPEN/CLOSE ====================
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
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

  // ==================== CLOSE ON ESCAPE ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div ref={containerRef} className="relative">
      {/* Search Icon */}
      <button
        ref={buttonRef}
        onClick={toggleSearch}
        aria-label="Rechercher"
        className="text-ink/80 transition-colors hover:text-navy"
      >
        <Search size={16} strokeWidth={1.6} />
      </button>

      {/* Search Input - Appears inline */}
      {isOpen && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-64">
          <div className="flex items-center gap-2 rounded-full border border-powder/30 bg-white/80 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <Search size={14} className="text-ink/30" strokeWidth={1.5} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 bg-transparent text-xs text-ink placeholder:text-ink/30 focus:outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-ink/20 hover:text-ink/50"
              >
                <X size={12} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {query.trim() && (
            <div className="absolute right-0 mt-2 w-64 max-h-60 overflow-y-auto rounded-lg border border-powder/30 bg-white/95 shadow-lg backdrop-blur-sm">
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
                      className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-powder/10"
                    >
                      <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded bg-powder/20">
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
      )}
    </div>
  );
}