import { ProductCard } from "@/components/storefront/ProductCard";
import { Decimal } from "@prisma/client/runtime/library";

type ProductForGrid = {
  id: string;
  slug: string;
  name: string;
  price: Decimal | number;
  oldPrice?: Decimal | number | null;
  images: { url: string }[];
};

export function ProductGrid({ products }: { products: ProductForGrid[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-brand-border py-20 text-center">
        <p className="text-base font-medium text-brand-text">No products found</p>
        <p className="mt-1 text-sm text-brand-text-muted">
          Try a different search term or clear your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          slug={product.slug}
          name={product.name}
          price={Number(product.price)}
          oldPrice={product.oldPrice ? Number(product.oldPrice) : null}
          imageUrl={product.images[0]?.url}
        />
      ))}
    </div>
  );
}