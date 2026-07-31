import Link from "next/link";
import Image from "next/image";
import { getLowStockProducts } from "@/lib/admin/products";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { AlertTriangle, Edit3, PackageCheck } from "lucide-react";

export default async function LowStockPage() {
  await requireAdmin();

  const lowStockProducts = await getLowStockProducts(20);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
            Alerte Stock Bas
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            {lowStockProducts.length}{" "}
            {lowStockProducts.length > 1
              ? "produits nécessitant un réapprovisionnement"
              : "produit nécessitant un réapprovisionnement"}{" "}
            (Stock ≤ 20)
          </p>
        </div>
        {lowStockProducts.length > 0 && (
          <div className="text-xs font-medium uppercase tracking-widest text-amber-800 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full whitespace-nowrap">
            {lowStockProducts.length} critique
            {lowStockProducts.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Table / Empty State Container  */}
      <div className="overflow-x-auto rounded-lg border border-powder/40">
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-12">
            <PackageCheck className="w-8 h-8 mx-auto mb-2 stroke-1 text-ink/30" />
            <p className="font-medium text-ink/70">Inventaire optimal</p>
            <p className="text-xs text-ink/40 mt-0.5">
              Tous les produits enregistrés disposent actuellement d’un niveau de
              stock supérieur au seuil d’alerte.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-powder/40 bg-powder/10 text-left text-xs uppercase tracking-widest text-ink/50">
              <tr>
                <th className="px-4 py-3">Produit</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix Unitaire</th>
                <th className="px-4 py-3">Niveau de Stock</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => {
                const isCritical = product.stock <= 5;
                const primaryImage = product.images?.[0]?.url;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-powder/20 last:border-0 hover:bg-powder/5 transition-colors"
                  >
                    {/* Product Info with Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-cream border border-powder/40 shrink-0">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink/30 text-[10px] font-medium">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-ink hover:text-navy transition-colors block">
                            {product.name}
                          </span>
                          <span className="text-xs text-ink/40 font-medium">
                            ID: {product.id.slice(-6)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-ink/60">
                      {product.category?.name || "Non catégorisé"}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-medium text-ink">
                      {Number(product.price).toLocaleString("fr-DZ")} DZD
                    </td>

                    {/* Stock Level Pill */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          isCritical
                            ? "bg-rose-500/10 text-rose-800 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isCritical ? "bg-rose-500" : "bg-amber-500"
                          }`}
                        />
                        {product.stock} {product.stock > 1 ? "unités" : "unité"}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-navy text-white hover:bg-navy/90 rounded-lg transition-all shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Réapprovisionner
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}