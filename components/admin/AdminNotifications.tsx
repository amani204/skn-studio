"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, PackageX, AlertTriangle } from "lucide-react";
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

  // Fetch low stock products from our new API route
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
    
    // Optional: poll data updates every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown overlay automatically if clicking anywhere outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alertCount = products.length;
 
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Trigger Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg p-2 transition-colors hover:bg-powder/10 ${
          isOpen ? "text-navy bg-powder/10" : "text-ink/40"
        }`}
        aria-label="Alertes Stock"
      >
        <Bell size={18} strokeWidth={1.5} />
        {alertCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 font-sans text-[9px] font-semibold text-white dynamic-ping animate-pulse">
            {alertCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Element */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-powder/30 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-powder/20 flex justify-between items-center">
            <span className="text-xs font-bold text-ink uppercase tracking-wider">Alertes de Stock</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${alertCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
              {alertCount} {alertCount === 1 ? "alerte" : "alertes"}
            </span>
          </div>

          <div className="mt-1 max-h-64 overflow-y-auto divide-y divide-powder/10">
            {alertCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-ink/40 px-4">
                <p className="text-xs font-medium text-emerald-600">Tout est en ordre ! ✨</p>
                <p className="text-[11px] mt-0.5">Aucun produit en rupture de stock.</p>
              </div>
            ) : (
              products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products`} // Adjust to match your admin edit product route path structure
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-3 hover:bg-powder/5 transition rounded-lg"
                >
                  <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${product.stock === 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                    {product.stock === 0 ? <PackageX size={14} /> : <AlertTriangle size={14} />}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <p className="text-xs font-semibold text-ink truncate">{product.name}</p>
                    <p className={`text-[10px] mt-1 font-medium ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock === 0 ? "Rupture de stock complète" : `Stock critique: uniquement ${product.stock} restants`}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}