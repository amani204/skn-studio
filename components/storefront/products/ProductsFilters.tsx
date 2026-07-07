"use client";

import { useState } from "react";
import type { ShopCategory } from "@/lib/products";
import { ChevronDown, Filter } from "lucide-react";

type ProductFiltersProps = {
  categories: ShopCategory[];
  activeCategory: string;
  onChange: (slug: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  onReset: () => void;
};

export default function ProductFilters({
  categories,
  activeCategory,
  onChange,
  minPrice,
  maxPrice,
  onPriceChange,
  onReset,
}: ProductFiltersProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const hasActiveFilters = activeCategory !== "all" || minPrice || maxPrice;

  return (
    <div className="w-full">
      {/* Mobile Filter Toggle */}
      <div className="mb-3 flex items-center gap-3 sm:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-powder/30 bg-cream/80 px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-navy/60 transition-all hover:border-navy/20 hover:text-navy"
        >
          <Filter size={14} strokeWidth={1.5} />
          <span>Filtres</span>
          {hasActiveFilters && (
            <span className="ml-1 h-1.5 w-1.5 rounded-full bg-navy" />
          )}
          <ChevronDown
            size={14}
            strokeWidth={1.5}
            className={`ml-auto transition-transform duration-300 ${
              isMobileFilterOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="rounded-xl border border-powder/30 bg-cream/80 px-3 py-2.5 text-[10px] font-medium uppercase tracking-widest text-ink/30 transition-all hover:border-navy/20 hover:text-navy"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Filters Bar */}
      <div
        className={`w-full overflow-hidden transition-all duration-300 ${
          isMobileFilterOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 sm:max-h-[500px] sm:opacity-100"
        }`}
      >
        <div className="flex flex-col gap-3 rounded-xl border border-powder/30 bg-cream/80 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Categories - Left */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => onChange("all")}
              className={`relative px-3 py-1.5 text-center text-xs font-medium uppercase tracking-widest transition-all ${
                activeCategory === "all"
                  ? "text-navy"
                  : "text-ink/40 hover:text-navy"
              }`}
            >
              Tout
              {activeCategory === "all" && (
                <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-navy" />
              )}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onChange(category.slug)}
                className={`relative px-3 py-1.5 text-center text-xs font-medium uppercase tracking-widest transition-all ${
                  activeCategory === category.slug
                    ? "text-navy"
                    : "text-ink/40 hover:text-navy"
                }`}
              >
                {category.name}
                {activeCategory === category.slug && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-navy" />
                )}
              </button>
            ))}
          </div>

          {/* Price Filters - Right */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-powder/30 bg-white/50 px-3 py-1.5">
              <span className="text-[10px] text-ink/30">DA</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onPriceChange(e.target.value, maxPrice)}
                className="w-16 bg-transparent py-1 text-sm text-ink placeholder:text-ink/30 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
            <span className="text-xs text-ink/20">—</span>
            <div className="flex items-center gap-1 rounded-lg border border-powder/30 bg-white/50 px-3 py-1.5">
              <span className="text-[10px] text-ink/30">DA</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onPriceChange(minPrice, e.target.value)}
                className="w-16 bg-transparent py-1 text-sm text-ink placeholder:text-ink/30 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>

            {(minPrice || maxPrice || activeCategory !== "all") && (
              <button
                onClick={onReset}
                className="hidden text-[10px] uppercase tracking-widest text-ink/25 transition-colors hover:text-navy sm:block"
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Mobile Reset */}
        {(minPrice || maxPrice || activeCategory !== "all") && (
          <button
            onClick={onReset}
            className="mt-2 block w-full text-center text-[10px] uppercase tracking-widest text-ink/25 transition-colors hover:text-navy sm:hidden"
          >
            Effacer tous les filtres
          </button>
        )}
      </div>
    </div>
  );
}