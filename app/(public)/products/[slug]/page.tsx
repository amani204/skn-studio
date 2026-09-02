import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductDetail } from "@/lib/products";
import AddToCartButton from "@/components/storefront/productDetails/AddToCartButton";
import ProductsCard from "@/components/storefront/products/ProductsCard";
import ReviewsSection from "@/components/storefront/productDetails/ReviewsSection";
import { Package, Truck, Shield } from "lucide-react";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductDetail(slug);

  if (!data) {
    return { title: "Produit introuvable | SKN Studio" };
  }

  return {
    title: `${data.product.name} | SKN Studio`,
    description: data.product.description.slice(0, 155),
    openGraph: {
      title: `${data.product.name} | SKN Studio`,
      description: data.product.description.slice(0, 155),
      images: data.product.images[0] ? [data.product.images[0]] : [],
    },
  };
}
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getProductDetail(slug);

  if (!data) {
    notFound();
  }

  const { product, reviews, averageRating, related } = data;

  // Product highlights
  const highlights = [
    { icon: Package, label: "Livraison 24-48h", color: "text-navy/60" },
    { icon: Truck, label: "Gratuite dès 5000 DA", color: "text-navy/60" },
    { icon: Shield, label: "Satisfaction garantie", color: "text-navy/60" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-8 sm:pt-40">
      {/* Product Section */}
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-powder/20">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/40">
                Pas d'image
              </div>
            )}
            {product.oldPrice && (
            <span className="absolute left-3 top-3 z-10 rounded-lg bg-green-400/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-green-300">
              Promo
            </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {/* Category */}
          <p className="text-xs uppercase tracking-[0.3em] text-blue">
            {product.category?.name || "Produit"}
          </p>

          {/* Name */}
          <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
            {product.name}
          </h1>

          {/* Rating */}
          {averageRating !== null && (
            <div className="mt-2 flex items-center gap-2 text-sm text-ink/60">
              <span className="text-blue">★</span>
              <span>{averageRating.toFixed(1)}</span>
              <span>
                ({reviews.length} avis{reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium text-navy sm:text-3xl">
              {product.price.toLocaleString()} DA
            </span>
            {product.oldPrice && (
              <span className="text-base text-ink/40 line-through sm:text-lg">
                {product.oldPrice.toLocaleString()} DA
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6 border-t border-powder/30 pt-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink/70">
              {product.description}
            </p>
          </div>

          {/* Add to Cart */}
          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          {/* Highlights */}
          <div className="mt-8 grid grid-cols-3 gap-2 border-t border-powder/30 pt-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center gap-1 text-center">
                  <Icon size={18} className={item.color} strokeWidth={1.5} />
                  <span className="text-[10px] uppercase tracking-widest text-ink/30">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewsSection productId={product.id} />

      {/* You May Also Like */}
      <section className="mt-20 border-t border-powder/30 pt-16">
        <div className="mb-10 text-center">
          <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
            Finalisez votre routine
          </span>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl md:text-4xl">
            Vous aimerez aussi
          </h2>
        </div>

        {related.length === 0 ? (
          <div className="mt-8 rounded-xl border border-powder/30 px-6 py-12 text-center">
            <p className="text-sm text-ink/40">
              Aucun produit similaire disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductsCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                oldPrice={p.oldPrice}
                imageUrl={p.images[0]}
                stock={p.stock}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}