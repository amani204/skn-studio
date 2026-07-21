"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { NewProductButton } from "@/components/admin/products/NewProductButton";
import { LowStockButton } from "@/components/admin/products/LowStockButton";
import { ProductsTable, type ProductItem } from "@/components/admin/products/ProductsTable";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des produits", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const lowStockCount = products.filter((p) => p.stock <= 20).length;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
            Catalogue Produits
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            Gérez votre inventaire, prix et mises en avant
          </p>
        </div>

        {/* Live Total Badge */}
        <div className="text-xs font-mono uppercase tracking-widest text-navy bg-powder/20 px-3 py-1.5 rounded-full w-fit">
          {loading ? "Chargement..." : `${products.length} Produits au total`}
        </div>
      </div>

      {/* Action Bar & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
          <input
            type="text"
            placeholder="Rechercher un produit, slug, catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-powder/50  backdrop-blur-sm text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all duration-200 shadow-sm"
          />
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <LowStockButton count={lowStockCount} />
          <NewProductButton />
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-ink/40  rounded-2xl border border-powder/30 backdrop-blur-sm">
          <Loader2 className="w-7 h-7 animate-spin mb-3 text-navy" />
          <p className="text-sm font-medium text-ink/60">
            Chargement du catalogue...
          </p>
        </div>
      ) : (
        <ProductsTable initialProducts={products} searchQuery={searchQuery} />
      )}
    </div>
  );
}