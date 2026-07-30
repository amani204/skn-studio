import "server-only";
import { prisma } from "@/lib/prisma";

// ==================== TYPES ====================

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  images: string[];
  categorySlug: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

export type ShopCategory = {
  slug: string;
  name: string;
};

export type ReviewData = {
  id: string;
  reviewerName: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date;
};

export type ProductDetailReturn = {
  product: ShopProduct;
  reviews: ReviewData[];
  averageRating: number | null;
  related: ShopProduct[];
};

// ==================== HELPERS ====================

type ProductWithRelations = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: unknown;
  oldPrice: unknown;
  stock: number;
  images: { url: string }[];
  category: { id: string; name: string; slug: string };
};

function toShopProduct(product: ProductWithRelations): ShopProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
    stock: product.stock,
    images: product.images.map((img) => img.url),
    categorySlug: product.category.slug,
    category: product.category,
  };
}

/** Fisher-Yates shuffle — unbiased, unlike Array.sort(() => Math.random() - 0.5) */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ==================== GET SHOP DATA ====================

export async function getShopData() {
  const [products, categoriesRaw] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const categories: ShopCategory[] = [
    ...categoriesRaw.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return {
    products: products.map(toShopProduct),
    categories,
  };
}

// ==================== GET FEATURED PRODUCTS (homepage "Nos Icônes") ====================

/**
 * Products the admin marked with isFeatured=true (max 4, enforced in the
 * admin dashboard's product service). `take: limit` here is just a safety
 * net in case that invariant is ever violated directly in the DB.
 */
export async function getFeaturedProducts(limit = 4): Promise<ShopProduct[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  return products.map(toShopProduct);
}

// ==================== GET PRODUCT DETAIL ====================

export async function getProductDetail(slug: string): Promise<ProductDetailReturn | null> {
  const product = await prisma.product.findUnique({
    where: { slug, isPublished: true },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return null;

  // ==================== RELATED PRODUCTS LOGIC ====================

  // 1. Prefer products from the same category (excluding the current one)
  const sameCategoryProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isPublished: true,
      id: { not: product.id },
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  let related = sameCategoryProducts.slice(0, 4);

  // 2. If fewer than 4 category matches exist, top up with other published
  //    products (excluding the current one and anything already picked above).
  //    Done in plain JS — no raw SQL, no risk of a broken exclusion filter.
  if (related.length < 4) {
    const alreadyPickedIds = new Set([product.id, ...related.map((p) => p.id)]);
    const additionalNeeded = 4 - related.length;

    const otherProducts = await prisma.product.findMany({
      where: {
        isPublished: true,
        id: { notIn: Array.from(alreadyPickedIds) },
      },
      include: {
        images: { orderBy: { order: "asc" } },
        category: true,
      },
    });

    const randomExtras = shuffle(otherProducts).slice(0, additionalNeeded);
    related = [...related, ...randomExtras];
  }

  const relatedShopProducts = related.map(toShopProduct);

  const reviews: ReviewData[] = product.reviews.map((r) => ({
    id: r.id,
    reviewerName: r.reviewerName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
  }));

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return {
    product: toShopProduct(product),
    reviews,
    averageRating,
    related: relatedShopProducts,
  };
}