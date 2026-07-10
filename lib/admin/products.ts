import "server-only";
import { prisma } from "@/lib/prisma";

const LOW_STOCK_THRESHOLD = 10;

export async function getAdminProducts(options?: { lowStockOnly?: boolean }) {
  const products = await prisma.product.findMany({
    where: options?.lowStockOnly ? { stock: { lt: LOW_STOCK_THRESHOLD } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return products.map((p) => ({
    ...p,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
  }));
}

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
  };
}

export async function getCategoriesForAdmin() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getFeaturedIconCount(excludeProductId?: string) {
  return prisma.product.count({
    where: {
      isFeatured: true,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
    },
  });
}