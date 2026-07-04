import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ProductFilters = {
  search?: string;
  category?: string; // category slug
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "oldest" | "price-asc" | "price-desc";
};

export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  const minPriceRaw = searchParams.get("minPrice");
  const maxPriceRaw = searchParams.get("maxPrice");

  return {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") || undefined,
    minPrice: minPriceRaw ? Number(minPriceRaw) : undefined,
    maxPrice: maxPriceRaw ? Number(maxPriceRaw) : undefined,
    sort: (searchParams.get("sort") as ProductFilters["sort"]) || "newest",
  };
}

export async function getProducts(filters: ProductFilters) {
  const where: Prisma.ProductWhereInput = {
    isPublished: true,
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "oldest"
      ? { createdAt: "asc" }
      : filters.sort === "price-asc"
      ? { price: "asc" }
      : filters.sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" }; // newest = default

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
      category: true,
    },
  });

  return products;
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
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
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      isPublished: true,
      id: { not: excludeProductId },
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    take: 4,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}