// path: components/admin/products/ProductsTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Edit2, Trash2, Loader2, PackageX } from "lucide-react";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  category?: { name: string } | null;
  images?: { url: string; alt?: string | null }[];
}

interface ProductsTableProps {
  initialProducts: ProductItem[];
  searchQuery: string;
}

export function ProductsTable({ initialProducts, searchQuery }: ProductsTableProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [loadingStarId, setLoadingStarId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  // Toggle Featured (Star) status
  const handleToggleFeatured = async (product: ProductItem) => {
    setErrorMsg(null);
    setLoadingStarId(product.id);

    const nextFeaturedState = !product.isFeatured;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextFeaturedState }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de modifier la mise en avant.");
      }

      // Update state locally
      setProducts((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, isFeatured: nextFeaturedState } : item
        )
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoadingStarId(null);
    }
  };

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.")) {
      return;
    }

    setErrorMsg(null);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible de supprimer le produit.");
      }

      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            className="text-xs font-semibold text-rose-600 hover:underline"
          >
            Fermer
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs uppercase font-semibold text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Vedette</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <PackageX className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-sm">Aucun produit trouvé</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const mainImage = p.images?.[0]?.url ?? "/placeholder.png";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Featured Star Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          disabled={loadingStarId === p.id}
                          title={p.isFeatured ? "Retirer des vedettes" : "Mettre en vedette (Max 4)"}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                        >
                          {loadingStarId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          ) : (
                            <Star
                              className={`w-4 h-4 transition-colors ${
                                p.isFeatured
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-300 hover:text-amber-400"
                              }`}
                            />
                          )}
                        </button>
                      </td>

                      {/* Product Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                            <Image
                              src={mainImage}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 leading-snug">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {p.category?.name ?? "Sans catégorie"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {Number(p.price).toLocaleString("fr-DZ")} DZD
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.stock <= 20
                              ? "bg-rose-50 text-rose-700 font-semibold"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {p.stock} en stock
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={deletingId === p.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            {deletingId === p.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}