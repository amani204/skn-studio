"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ProductCard from "./ProductsCard";
import Pagination from "./Pagination";
import type { ShopProduct, ShopCategory } from "@/lib/products";
import ProductFilters from "./ProductsFilters";
import { Search } from "lucide-react";

const PAGE_SIZE = 6;

type ShopPageClientProps = {
  products: ShopProduct[];
  categories: ShopCategory[];
};

export default function ShopPageClient({ products, categories }: ShopPageClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // ==================== FILTER PRODUCTS ====================
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categorySlug === activeCategory;

      const min = minPrice ? Number(minPrice) : undefined;
      const max = maxPrice ? Number(maxPrice) : undefined;
      const matchesMin = min === undefined || p.price >= min;
      const matchesMax = max === undefined || p.price <= max;

      return matchesCategory && matchesMin && matchesMax;
    });
  }, [products, activeCategory, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  // ==================== RESET PAGE ON FILTER CHANGE ====================
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, minPrice, maxPrice]);

  // ==================== HEADER ANIMATION ====================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    });
    return () => ctx.revert();
  }, []);

  // ==================== GRID ANIMATION ====================
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".shop-card",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [activeCategory, minPrice, maxPrice, currentPage]);

  // ==================== HANDLE PAGE CHANGE ====================
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ==================== HANDLE FILTER RESET ====================
  const handleReset = () => {
    setActiveCategory("all");
    setMinPrice("");
    setMaxPrice("");
  };

  // ==================== HANDLE PRICE CHANGE ====================
  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  // ==================== RENDER ====================
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Header */}
      <div ref={headerRef} className="mb-10 text-center">
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
          Boutique
        </span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Toutes nos formules
        </h1>
        <p className="mt-2 text-sm text-ink/50">
          Des routines simples, clairement étiquetées.
        </p>
        <p className="mt-1 text-xs text-ink/30">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} disponible{filteredProducts.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters - Integrated */}
      <ProductFilters
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={handlePriceChange}
        onReset={handleReset}
      />

      {/* Products Grid */}
      <div ref={gridRef} className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {pageProducts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-powder/20">
              <Search size={24} className="text-ink/20" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-ink/40">Aucun produit ne correspond à ces filtres.</p>
            <button
              onClick={handleReset}
              className="mt-4 text-xs uppercase tracking-widest text-navy/50 transition-colors hover:text-navy"
            >
              Voir tous les produits
            </button>
          </div>
        ) : (
          pageProducts.map((product) => (
            <div key={product.id} className="shop-card">
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                oldPrice={product.oldPrice}
                imageUrl={product.images[0]}
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </main>
  );
}