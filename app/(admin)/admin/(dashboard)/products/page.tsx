// path: app/(admin)/admin/(dashboard)/products/page.tsx
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
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un produit ou catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <LowStockButton count={lowStockCount} />
          <NewProductButton />
        </div>
      </div>

      {/* Main Table Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <p className="text-sm">Chargement du catalogue...</p>
        </div>
      ) : (
        <ProductsTable initialProducts={products} searchQuery={searchQuery} />
      )}
    </div>
  );
}