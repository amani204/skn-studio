// lib/products.ts
import { prisma } from "@/lib/prisma";

export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;        // ← number, not Decimal
  oldPrice: number | null;  // ← number, not Decimal
  description: string;
  categorySlug: string;
  images: string[];
  stock: number;
};

export type ShopCategory = {
  id: string;
  name: string;
  slug: string;
};

export async function getShopData() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        oldPrice: true,
        description: true,
        category: { select: { slug: true } },
        images: { select: { url: true }, orderBy: { order: "asc" } },
        stock: true,
      },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return {
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),  // ← Convert Decimal to number
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,  // ← Convert Decimal to number
      description: p.description,
      categorySlug: p.category.slug,
      images: p.images.map((img) => img.url),
      stock: p.stock,
    })),
    categories,
  };
}

export async function getProductDetail(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
      reviews: {
        where: { isApproved: true },
        select: { id: true, rating: true, comment: true, reviewerName: true, createdAt: true },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),  // ← Convert Decimal to number
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,  // ← Convert Decimal to number
  };
}