import Link from "next/link";
import { getAdminProducts } from "@/lib/admin/products";
import ProductsTable from "@/components/admin/products/ProductsTable";

type PageProps = {
  searchParams: Promise<{ lowStock?: string }>;
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { lowStock } = await searchParams;
  const lowStockOnly = lowStock === "true";

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
          className={`rounded-lg px-4 py-2 text-sm ${
            !lowStockOnly ? "bg-navy text-white" : "border border-powder/40 text-ink/60"
          }`}
        >
          Tous
        </Link>
        <Link
          href="/admin/products?lowStock=true"
          className={`rounded-lg px-4 py-2 text-sm ${
            lowStockOnly ? "bg-navy text-white" : "border border-powder/40 text-ink/60"
          }`}
        >
          Stock faible (&lt; 10)
        </Link>
      </div>

      <ProductsTable products={[]}  />
    </div>
  );
}