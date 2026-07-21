"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Edit2, Trash2, Loader2, PackageX, AlertCircle, X } from "lucide-react";

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
      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="p-1 rounded-md text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Table Container aligned with DeliveryRatesTable */}
      <div className="overflow-x-auto rounded-lg border border-powder/40">
        <table className="w-full text-sm">
          <thead className="border-b border-powder/40 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
            <tr>
              <th className="px-4 py-3 w-12 text-center">Vedette</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-ink/40">
                  <PackageX className="w-8 h-8 mx-auto mb-2 stroke-1 text-ink/30" />
                  <p className="font-medium text-ink/70">Aucun produit trouvé</p>
                  <p className="text-xs text-ink/40 mt-0.5">
                    Essayez de modifier votre recherche
                  </p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const mainImage = p.images?.[0]?.url ?? "/placeholder.png";

                return (
                  <tr key={p.id} className="border-b border-powder/20 last:border-0 hover:bg-powder/5 transition-colors">
                    {/* Featured Star Toggle */}
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        disabled={loadingStarId === p.id}
                        title={p.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                        className="p-1 rounded-md hover:bg-powder/20 transition-colors disabled:opacity-50 inline-flex items-center justify-center"
                      >
                        {loadingStarId === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-navy" />
                        ) : (
                          <Star
                            className={`w-4 h-4 transition-colors ${
                              p.isFeatured
                                ? "fill-amber-400 text-amber-500"
                                : "text-powder hover:text-amber-400"
                            }`}
                          />
                        )}
                      </button>
                    </td>

                    {/* Product Thumbnail & Details */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-md overflow-hidden bg-cream border border-powder/40 shrink-0">
                          <Image
                            src={mainImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink truncate max-w-xs">
                            {p.name}
                          </p>
                          <p className="text-[11px] font-mono text-ink/40 truncate max-w-xs">
                            {p.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="px-4 py-2 text-ink/60">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-powder/10 border border-powder/30 text-ink/70">
                        {p.category?.name ?? "Sans catégorie"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-2 font-medium text-ink">
                      {Number(p.price).toLocaleString("fr-DZ")} DA
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono ${
                          p.stock <= 20
                            ? "bg-rose-50 text-rose-700 font-semibold border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {p.stock} unit.
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-md text-ink/50 hover:text-navy hover:bg-powder/20 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 rounded-md text-ink/50 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                          title="Supprimer"
                        >
                          {deletingId === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
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
  );
}