import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getProductDetail } from "@/lib/products";
import AddToCartButton from "@/components/storefront/products/AddToCartButton";
import ReviewForm from "@/components/storefront/products/ReviewForm";
import ProductsCard from "@/components/storefront/products/ProductsCard";
import { Star, Package, Truck, Shield, Heart } from "lucide-react";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getProductDetail(params.slug);

  if (!data) {
    return { title: "Product not found" };
  }

  return {
    title: data.product.name,
    description: data.product.description.slice(0, 155),
    openGraph: {
      title: data.product.name,
      description: data.product.description.slice(0, 155),
      images: data.product.images[0] ? [data.product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const data = await getProductDetail(params.slug);

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
      <div className="grid gap-12 md:grid-cols-2">
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
              <span className="absolute left-4 top-4 rounded-full bg-navy/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-navy backdrop-blur-sm">
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
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-medium text-navy">
              {product.price.toLocaleString()} DA
            </span>
            {product.oldPrice && (
              <span className="text-lg text-ink/40 line-through">
                {product.oldPrice.toLocaleString()} DA
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-4 flex items-center gap-2">
            <p className="text-xs uppercase tracking-widest text-ink/50">
              {product.stock > 0 ? `en stock` : "Rupture de stock"}
            </p>
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
      <section className="mt-20 border-t border-powder/30 pt-16 text-center">
        <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
          Avis
        </span>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
          Votre Avis
        </h1>
        
        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-powder/30 px-6 py-12 text-center">
              <p className="text-sm text-ink/40">
                Aucun avis pour l'instant. Soyez le premier à donner votre avis.
              </p>
            </div>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-powder/30 p-6 transition-all hover:border-navy/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-medium text-ink">
                      {review.reviewerName ?? "Anonyme"}
                    </span>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < review.rating ? "text-blue" : "text-powder/30"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-ink/30">
                    {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    {review.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-12 rounded-xl border border-powder/30 p-6">
          <h3 className="text-xs uppercase tracking-widest text-ink/60">
            Laisser un avis
          </h3>
          <div className="mt-4">
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </section>

{/* You May Also Like */}
<section className="mt-20 border-t border-powder/30 pt-16">
   <div className="mb-10 text-center">
   <span className="inline-block text-xs uppercase tracking-[0.3em] text-blue">
    Finalisez votre routine
    </span>
    <h1 className="mt-3 font-display text-3xl  text-ink sm:text-4xl">
      Vous aimerez aussi
    </h1>
    </div>
  {related.length === 0 ? (
    <div className="mt-8 rounded-xl border border-powder/30px-6 py-12 text-center">
      <p className="text-sm text-ink/40">
        Aucun produit similaire disponible pour le moment.
      </p>
    </div>
  ) : (
    <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {related.map((p) => (
        <ProductsCard
          key={p.id}
          id={p.id}
          slug={p.slug}
          name={p.name}
          price={p.price}
          oldPrice={p.oldPrice}
          imageUrl={p.images[0]}
        />
      ))}
    </div>
  )}
</section>
    </main>
  );
}