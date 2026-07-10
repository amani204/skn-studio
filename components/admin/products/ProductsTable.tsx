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
  isFeatured: boolean;
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
    return <p className="py-16 text-center text-sm text-ink/40">Aucun produit.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-powder/40">
      <table className="w-full text-sm">
        <thead className="border-b border-powder/40 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
          <tr>
            <th className="px-4 py-3">Produit</th>
            <th className="px-4 py-3">Catégorie</th>
            <th className="px-4 py-3">Prix</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Statut</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-powder/20 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-powder/20">
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <span className="text-ink">
                    {product.name}
                    {product.isFeatured && (
                      <span className="ml-2 rounded-full bg-navy/10 px-2 py-0.5 text-[10px] text-navy">
                        Icône
                      </span>
                    )}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-ink/60">{product.category.name}</td>
              <td className="px-4 py-3 text-ink/60">{product.price.toLocaleString()} DA</td>
              <td className="px-4 py-3">
                <span className={product.stock < 10 ? "font-medium text-red-600" : "text-ink/60"}>
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    product.isPublished ? "bg-green-50 text-green-700" : "bg-ink/5 text-ink/40"
                  }`}
                >
                  {product.isPublished ? "Publié" : "Brouillon"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="mr-3 text-navy hover:underline"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDelete(product.id, product.name)}
                  disabled={deletingId === product.id}
                  className="text-red-600 hover:underline disabled:opacity-50"
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