import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number | null;
  imageUrl?: string;
};

export function ProductCard({ slug, name, price, oldPrice, imageUrl }: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-lg border border-brand-border bg-brand-surface transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-bg">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-brand-text-muted">
            No image
          </div>
        )}
        {oldPrice && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-accent px-2 py-0.5 text-xs font-medium text-brand-text">
            Sale
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-brand-text">{name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-brand-text">
            {price.toFixed(2)} DA
          </span>
          {oldPrice && (
            <span className="text-xs text-brand-text-muted line-through">
              {oldPrice.toFixed(2)} DA
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}