import Link from "next/link";
import Image from "next/image";
import { getLowStockProducts } from "@/lib/admin/products";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { ArrowLeft, AlertTriangle, Edit3, PackageCheck } from "lucide-react";

export default async function LowStockPage() {
  await requireAdmin();

  // Fetch products with stock <= 20
  const lowStockProducts = await getLowStockProducts(20);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
          href="/admin/products"
          className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          title="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
                Alerte Stock Bas
              </h1>
            </div>
            <p className="mt-1 text-sm text-ink/60 font-body">
              Produits nécessitant un réapprovisionnement imminence (Stock ≤ 20)
            </p>
          </div>
        </div>

        {/* Status Badge Counter */}
        <div className="text-xs font-meduim uppercase tracking-widest text-amber-800 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full w-fit">
          {lowStockProducts.length}{" "}
          {lowStockProducts.length > 1 ? "Produits critiques" : "Produit critique"}
        </div>
      </div>

      {/* Main Table or Empty State */}
      {lowStockProducts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-powder/80 rounded-lg bg-white/40 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-lg bg-powder/20 text-navy flex items-center justify-center mx-auto mb-4">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-display font-medium text-ink">
            Inventaire optimal
          </h3>
          <p className="text-xs text-ink/50 mt-1 max-w-sm mx-auto font-body">
            Tous les produits enregistrés disposent actuellement d'un niveau de stock supérieur au seuil d'alerte.
          </p>
        </div>
      ) : (
        <div className="border border-powder/60 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-powder/40 bg-cream/40 text-ink/60 font-meduim text-xs uppercase tracking-wider">
                  <th className="px-6 py-4">Produit</th>
                  <th className="px-6 py-4">Catégorie</th>
                  <th className="px-6 py-4">Prix Unitaire</th>
                  <th className="px-6 py-4">Niveau de Stock</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-powder/30 font-body">
                {lowStockProducts.map((product) => {
                  const isCritical = product.stock <= 5;
                  const primaryImage = product.images?.[0]?.url;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-powder/10 transition-colors group"
                    >
                      {/* Product Info with Thumbnail */}
                      <td className="px-6 py-4">
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
                              <div className="w-full h-full flex items-center justify-center text-ink/30 text-[10px] font-meduim">
                                N/A
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-ink group-hover:text-navy transition-colors block">
                              {product.name}
                            </span>
                            <span className="text-xs text-ink/40 font-meduim">
                              ID: {product.id.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 text-ink/60">
                        {product.category?.name || "Non catégorisé"}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-meduim font-medium text-ink">
                        {Number(product.price).toLocaleString("fr-DZ")} DZD
                      </td>

                      {/* Stock Level Pills */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-meduim font-medium ${
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

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
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
          </div>
        </div>
      )}
    </div>
  );
}