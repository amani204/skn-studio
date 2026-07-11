import Link from "next/link";
import { getAdminProducts } from "@/lib/admin/products";
import ProductsTable from "@/components/admin/products/ProductsTable";

type PageProps = {
  searchParams: Promise<{ lowStock?: string }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { lowStock } = await searchParams;
  const lowStockOnly = lowStock === "true";

  // ✅ FIX: Get actual products from database
  const products = await getAdminProducts({ lowStockOnly });

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Produits</h1>
          <p className="mt-1 text-sm text-ink/50">{products.length} produit(s)</p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/80"
        >
          + Nouveau produit
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <Link
          href="/admin/products"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            !lowStockOnly
              ? "bg-navy text-white shadow-sm"
              : "border border-powder/30 text-ink/50 hover:border-navy/20 hover:text-navy"
          }`}
        >
          Tous
        </Link>
        <Link
          href="/admin/products?lowStock=true"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            lowStockOnly
              ? "bg-navy text-white shadow-sm"
              : "border border-powder/30 text-ink/50 hover:border-navy/20 hover:text-navy"
          }`}
        >
          Stock faible <span className="text-xs opacity-60">(&lt; 10)</span>
        </Link>
      </div>

      {/* Pass the actual products */}
      <ProductsTable products={products} />
    </div>
  );
}