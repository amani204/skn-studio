import { Suspense } from "react";
import { getProducts, getCategories, parseProductFilters } from "@/lib/products";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { SearchBar } from "@/components/storefront/SearchBar";
import { Filters } from "@/components/storefront/Filters";

export const metadata = {
  title: "All Products",
  description: "Browse our full skincare collection.",
};

type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

async function ProductsContent({ searchParams }: PageProps) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") params.set(key, value);
  });

  const filters = parseProductFilters(params);
  const [products, categories] = await Promise.all([getProducts(filters), getCategories()]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar />
        <Filters categories={categories} />
      </div>

      <ProductGrid products={products} />
    </>
  );
}

export default function ProductsPage({ searchParams }: PageProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 font-display text-2xl text-brand-text">Shop All</h1>

      <Suspense fallback={<CatalogSkeleton />}>
        <ProductsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-lg bg-brand-border" />
          <div className="mt-2 h-4 w-3/4 rounded bg-brand-border" />
          <div className="mt-1 h-4 w-1/3 rounded bg-brand-border" />
        </div>
      ))}
    </div>
  );
}