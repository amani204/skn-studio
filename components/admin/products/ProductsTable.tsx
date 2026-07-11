"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isPublished: boolean;
  images: { url: string }[];
  category: { name: string };
};

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Supprimer "${name}" ? Cette action est irréversible. Les commandes passées conserveront le nom et le prix du produit.`
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Échec de la suppression");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setDeletingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-ink/40">Aucun produit.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-powder/30 bg-white/50">
      <table className="w-full text-sm">
        <thead className="border-b border-powder/30 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
          <tr>
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Prix</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-powder/20 last:border-0 hover:bg-powder/5">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-powder/20">
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="font-medium text-ink">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-ink/60">{product.category?.name || "—"}</td>
              <td className="px-4 py-3 text-navy">{product.price.toLocaleString()} DA</td>
              <td className="px-4 py-3">
                <span
                  className={
                    product.stock < 10
                      ? "font-medium text-red-600"
                      : "text-ink/60"
                  }
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    product.isPublished
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-ink/5 text-ink/40"
                  }`}
                >
                  {product.isPublished ? "Publié" : "Brouillon"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="mr-3 text-navy transition-colors hover:text-navy/70"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deletingId === product.id}
                  className="text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
                >
                  {deletingId === product.id ? "..." : "Supprimer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}