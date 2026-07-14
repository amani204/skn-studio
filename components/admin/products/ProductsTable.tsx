"use client";

import { useEffect, useState } from "react";
import { Edit2, Trash2, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/product");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm("Supprimer définitivement ce produit ?")) return;

    try {
      const res = await fetch(`/api/admin/product/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Filter out deleted product immediately without full refetch payload
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-ink/50">
        <RefreshCw size={16} className="animate-spin text-navy" />
        <span>Chargement du catalogue...</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-powder/30 border-dashed p-6 text-center text-ink/40">
        <AlertTriangle size={32} className="stroke-[1.5] mb-2 text-ink/30" />
        <p className="text-sm font-semibold">Aucun produit trouvé</p>
        <p className="text-xs">Votre catalogue de produits est actuellement vide.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-powder/30 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-powder/10 border-b border-powder/30 text-xs font-bold uppercase tracking-wider text-ink/50">
            <th className="px-6 py-4">Nom du produit</th>
            <th className="px-6 py-4">Prix</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-powder/20 text-sm">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-powder/5 transition-colors">
              {/* Product Info Block */}
              <td className="px-6 py-4">
                <span className="font-semibold text-ink">{product.name}</span>
              </td>

              {/* Price Grid Cell */}
              <td className="px-6 py-4 font-mono font-medium text-ink">
                {Number(product.price).toLocaleString()} DA
              </td>

              {/* Stock Status Indicator Badge */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    product.stock === 0
                      ? "bg-red-50 text-red-700"
                      : product.stock <= 20
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {product.stock} unités
                </span>
              </td>

              {/* Actions Interaction Buttons Row */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  {/* Edit - Navigates to dedicated page */}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="p-1.5 text-ink/50 hover:text-blue-600 hover:bg-powder/10 rounded transition-colors"
                    title="Modifier le produit"
                  >
                    <Edit2 size={15} />
                  </Link>

                  {/* Delete - Calls localized execution context function */}
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 text-ink/50 hover:text-red-600 hover:bg-powder/10 rounded transition-colors"
                    title="Supprimer définitivement"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}