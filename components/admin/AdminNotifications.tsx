"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, PackageX, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface LowStockProduct {
  id: string;
  name: string;
  slug: string;
  stock: number;
}

export function AdminNotifications() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/admin/products/low-stock");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed loading notifications:", err);
      }
    }
    fetchAlerts();

    // Poll for inventory updates every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown overlay when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alertCount = products.length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg p-2.5 transition-colors border ${
          isOpen
            ? "text-navy bg-powder/30 border-powder/80"
            : "text-ink/60 hover:text-ink hover:bg-powder/20 border-transparent"
        }`}
        aria-label="Alertes Stock"
      >
        <Bell className="w-5 h-5" strokeWidth={1.75} />
        {alertCount > 0 && (
          <span className="absolute bottom-6 left-5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow-xs animate-pulse">
            {alertCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-lg border border-cream/80 bg-white/95 backdrop-blur-md p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-3 py-2.5 border-b border-powder/50 flex justify-between items-center">
            <span className="text-xs font-medium uppercase tracking-wider text-ink/70">
              Alertes de Stock
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                alertCount > 0
                  ? "bg-rose-500/10 text-rose-700 border-rose-500/20"
                  : "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              }`}
            >
              {alertCount} {alertCount === 1 ? "alerte" : "alertes"}
            </span>
          </div>

          {/* Items List */}
          <div className="mt-1 max-h-72 overflow-y-auto divide-y divide-powder/20">
            {alertCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center px-4 space-y-1.5">
                <CheckCircle2 className="w-8 h-8 text-emerald-600/80 mb-1" />
                <p className="text-xs font-medium text-ink">
                  Tout est en ordre ! 
                </p>
                <p className="text-[11px] text-ink/50">
                  Aucun produit ne requiert votre attention pour le moment.
                </p>
              </div>
            ) : (
              products.map((product) => (
                <Link
                  key={product.id}
                  href="/admin/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-3 hover:bg-powder/20 transition-colors rounded-lg group"
                >
                  <div
                    className={`mt-0.5 rounded-lg p-2 shrink-0 border ${
                      product.stock === 0
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }`}
                  >
                    {product.stock === 0 ? (
                      <PackageX className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight space-y-0.5">
                    <p className="text-xs font-medium text-ink truncate group-hover:text-navy transition-colors">
                      {product.name}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${
                        product.stock === 0 ? "text-rose-600" : "text-amber-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Rupture de stock complète"
                        : `Stock critique: ${product.stock} restants`}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer Navigation Link */}
          <div className="mt-1 pt-1 border-t border-powder/50">
            <Link
              href="/admin/products/low-stock"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-between p-2.5 rounded-lg hover:bg-navy/5 text-xs font-medium uppercase tracking-wider text-navy transition-colors group"
            >
              <span>Voir tous les stocks bas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}