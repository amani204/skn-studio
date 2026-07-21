import "server-only";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { AppError } from "@/lib/errors";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validation/product";

const MAX_FEATURED_PRODUCTS = 4;

/**
 * Fetches all products from the database, ordered by creation date.
 */
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error("Database error in getAllProducts:", error);
    throw new Error("Impossible de récupérer les produits.");
  }
}

/**
 * Fetches products that are below or equal to a specific stock threshold.
 */
export async function getLowStockProducts(threshold = 20) {
  try {
    return await prisma.product.findMany({
      where: { stock: { lte: threshold } },
      orderBy: { stock: "asc" },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error("Database error in getLowStockProducts:", error);
    throw new Error("Impossible de récupérer les produits en rupture de stock.");
  }
}

/**
 * Fetches a single product by its unique ID.
 */
export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch (error) {
    console.error(`Database error in getProductById for ID ${id}:`, error);
    throw new Error("Impossible de récupérer les détails du produit.");
  }
}

/** Used to enforce "max 4 featured products" server-side, not just in the UI. */
export async function getFeaturedCount(excludeProductId?: string) {
  return prisma.product.count({
    where: {
      isFeatured: true,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
    },
  });
}

/**
 * Generates a unique slug for a product, appending "-2", "-3", etc.
 * if the base slug is already taken. Excludes the product's own id
 * so updating a product without changing its name doesn't collide with itself.
 */
async function generateUniqueProductSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name);
  const safeBase = base || "produit";
  let slug = safeBase;
  let counter = 1;

  // Bounded loop — 50 attempts is far more than any real catalog will need.
  for (let i = 0; i < 50; i++) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    counter += 1;
    slug = `${safeBase}-${counter}`;
  }

  // Extremely unlikely fallback to guarantee uniqueness.
  return `${safeBase}-${Date.now()}`;
}

/**
 * Creates a product with its images in a single transaction.
 * Enforces the "max 4 featured products" business rule.
 */
export async function createProduct(data: CreateProductInput) {
  if (data.isFeatured) {
    const featuredCount = await getFeaturedCount();
    if (featuredCount >= MAX_FEATURED_PRODUCTS) {
      throw new AppError(
        `Vous ne pouvez pas mettre en avant plus de ${MAX_FEATURED_PRODUCTS} produits à la fois. Retirez-en un d'abord.`,
        409,
        "FEATURED_LIMIT_REACHED"
      );
    }
  }

  const slug = await generateUniqueProductSlug(data.name);

  try {
    return await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        oldPrice: data.oldPrice ?? null,
        stock: data.stock,
        categoryId: data.categoryId,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((img, index) => ({
            url: img.url,
            alt: img.alt ?? null,
            order: img.order ?? index,
          })),
        },
      },
      include: {
        category: { select: { name: true } },
        images: { orderBy: { order: "asc" } },
      },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AppError("Un produit avec ce slug existe déjà. Réessayez.", 409, "DUPLICATE_SLUG");
    }
    if (error?.code === "P2003") {
      throw new AppError("La catégorie sélectionnée n'existe pas.", 400, "INVALID_CATEGORY");
    }
    console.error("Database error in createProduct:", error);
    throw new AppError("Impossible de créer le produit.", 500);
  }
}
/**
 * Updates a product. If `images` is provided, the entire image set is
 * replaced (deleted + recreated) inside a transaction.
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Produit introuvable.", 404, "PRODUCT_NOT_FOUND");
  }

  if (data.isFeatured === true && !existing.isFeatured) {
    const featuredCount = await getFeaturedCount(id);
    if (featuredCount >= MAX_FEATURED_PRODUCTS) {
      throw new AppError(
        `Vous ne pouvez pas mettre en avant plus de ${MAX_FEATURED_PRODUCTS} produits à la fois. Retirez-en un d'abord.`,
        409,
        "FEATURED_LIMIT_REACHED"
      );
    }
  }

  try {
    return await prisma.$transaction(
      async (tx) => {
        if (data.images) {
          await tx.productImage.deleteMany({ where: { productId: id } });
        }

        return tx.product.update({
          where: { id },
          data: {
            ...(data.name !== undefined ? { name: data.name } : {}),
            ...(data.description !== undefined ? { description: data.description } : {}),
            ...(data.price !== undefined ? { price: data.price } : {}),
            ...(data.oldPrice !== undefined ? { oldPrice: data.oldPrice } : {}),
            ...(data.stock !== undefined ? { stock: data.stock } : {}),
            ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
            ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
            ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
            ...(data.images
              ? {
                  images: {
                    create: data.images.map((img, index) => ({
                      url: img.url,
                      alt: img.alt ?? null,
                      order: img.order ?? index,
                    })),
                  },
                }
              : {}),
          },
          include: {
            category: { select: { name: true } },
            images: { orderBy: { order: "asc" } },
          },
        });
      },
      {
        timeout: 15000, // 👈 Extended from default 5000ms to 15000ms to avoid dev transaction timeouts
        maxWait: 5000,
      }
    );
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    if (error?.code === "P2025") {
      throw new AppError("Produit introuvable.", 404, "PRODUCT_NOT_FOUND");
    }
    if (error?.code === "P2003") {
      throw new AppError("La catégorie sélectionnée n'existe pas.", 400, "INVALID_CATEGORY");
    }
    console.error(`Database error in updateProduct for ID ${id}:`, error);
    throw new AppError("Impossible de mettre à jour le produit.", 500);
  }
}
/**
 * Deletes a product. Related ProductImages cascade automatically;
 * related OrderItems have productId set to null (order history is preserved).
 */
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Produit introuvable.", 404, "PRODUCT_NOT_FOUND");
    }
    console.error(`Database error in deleteProduct for ID ${id}:`, error);
    throw new AppError("Impossible de supprimer le produit.", 500);
  }
}