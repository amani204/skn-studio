// path: app/admin/products/low-stock/page.tsx
import Link from "next/link";
import { getLowStockProducts } from "@/lib/admin/products";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { ArrowLeft, AlertTriangle, Edit3, Package } from "lucide-react";

export default async function LowStockPage() {
  await requireAdmin();

  // Fetch products with stock <= 20
  const lowStockProducts = await getLowStockProducts(20);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
            title="Retour aux produits"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Produits en Stock Bas
            </h1>
            <p className="text-sm text-neutral-500">
              {lowStockProducts.length} produit(s) nécessitent un réapprovisionnement (Stock ≤ 20).
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      {lowStockProducts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-neutral-800">Aucun produit en stock bas</h3>
          <p className="text-sm text-neutral-500 mt-1">Tous vos produits ont un niveau de stock suffisant.</p>
        </div>
      ) : (
        <div className="border border-neutral-200/80 rounded-2xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 font-medium">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Stock Restant</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {product.category?.name || "Non catégorisé"}
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-800">
                    {Number(product.price).toLocaleString("fr-DZ")} DZD
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      {product.stock} restants
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Réapprovisionner
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}