import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/storefront/home/ProductGrid";
import type { Metadata } from "next";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-brand-bg">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-brand-text-muted">
                No image
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-md bg-brand-bg"
                >
                  <Image
                    src={img.url}
                    alt={img.alt ?? product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-sm uppercase tracking-wide text-brand-text-muted">
            {product.category.name}
          </p>
          <h1 className="mt-1 font-display text-3xl text-brand-text">{product.name}</h1>

          {averageRating !== null && (
            <div className="mt-2 flex items-center gap-1 text-sm text-brand-text-muted">
              <span className="text-brand-accent">★</span>
              <span>{averageRating.toFixed(1)}</span>
              <span>({product.reviews.length} reviews)</span>
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-brand-text">
              {Number(product.price).toFixed(2)} DA
            </span>
            {product.oldPrice && (
              <span className="text-base text-brand-text-muted line-through">
                {Number(product.oldPrice).toFixed(2)} DA
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-brand-text-muted">
            {product.description}
          </p>

          <p className="mt-4 text-sm text-brand-text-muted">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {/* Add to cart / WhatsApp order buttons come in Day 4 */}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="mb-4 font-display text-xl text-brand-text">Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-sm text-brand-text-muted">No reviews yet. Be the first to leave one.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-brand-border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-brand-text">
                    {review.reviewerName ?? "Anonymous"}
                  </span>
                  <span className="text-sm text-brand-accent">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-2 text-sm text-brand-text-muted">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Review submission form comes with Day 4/5 work */}
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-display text-xl text-brand-text">You might also like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}