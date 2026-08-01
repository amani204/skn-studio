import "server-only";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { AppError } from "@/lib/errors";
import type { CreateCategoryInput } from "@/lib/validation/category";

/**
 * Fetches all categories, including a product count (used both for the
 * dashboard list and to decide whether a delete needs confirmation).
 */
export async function getAllCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
  } catch (error) {
    console.error("Database error in getAllCategories:", error);
    throw new Error("Impossible de récupérer les catégories.");
  }
}

/** Categories other than the given one — used to populate the "move products to" dropdown. */
export async function getOtherCategories(excludeId: string) {
  return prisma.category.findMany({
    where: { id: { not: excludeId } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryProductCount(categoryId: string) {
  return prisma.product.count({ where: { categoryId } });
}

async function generateUniqueCategorySlug(name: string): Promise<string> {
  const base = slugify(name);
  const safeBase = base || "categorie";
  let slug = safeBase;
  let counter = 1;

  for (let i = 0; i < 50; i++) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) return slug;
    counter += 1;
    slug = `${safeBase}-${counter}`;
  }

  return `${safeBase}-${Date.now()}`;
}

/**
 * Creates a category. Rejects duplicate names (case-insensitive)
 * with a friendly 409 rather than letting a raw DB constraint bubble up.
 */
export async function createCategory(data: CreateCategoryInput) {
  const name = data.name.trim();

  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (existing) {
    throw new AppError("Une catégorie avec ce nom existe déjà.", 409, "DUPLICATE_CATEGORY");
  }

  const slug = await generateUniqueCategorySlug(name);

  try {
    return await prisma.category.create({
      data: { name, slug, image: data.image ?? null },
    });
  } catch (error: any) {
    if (error?.code === "P2002") {
      throw new AppError("Une catégorie avec ce nom existe déjà.", 409, "DUPLICATE_CATEGORY");
    }
    console.error("Database error in createCategory:", error);
    throw new AppError("Impossible de créer la catégorie.", 500);
  }
}

export type DeleteCategoryOptions =
  | { mode: "cascade" }
  | { mode: "reassign"; targetCategoryId: string };

export type DeleteCategoryResult = {
  deletedProductCount: number;
  reassignedProductCount: number;
  /** Storage paths to clean up after the DB transaction — only non-empty in cascade mode. */
  imageUrls: string[];
};

/**
 * Deletes a category. The caller must specify what happens to its products:
 *
 * - `{ mode: "cascade" }` — deletes every product in the category too
 *   (their images/reviews cascade automatically per the schema; past
 *   orders are unaffected since OrderItem.productId is SetNull).
 * - `{ mode: "reassign", targetCategoryId }` — moves every product to
 *   another category first, then deletes the now-empty category. No
 *   products are touched, nothing is lost.
 *
 * Both paths run inside a single DB transaction so the category never
 * ends up half-deleted.
 */
export async function deleteCategory(
  categoryId: string,
  options: DeleteCategoryOptions
): Promise<DeleteCategoryResult> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    throw new AppError("Catégorie introuvable.", 404, "CATEGORY_NOT_FOUND");
  }

  if (options.mode === "reassign") {
    if (options.targetCategoryId === categoryId) {
      throw new AppError(
        "Choisissez une catégorie différente de celle que vous supprimez.",
        400,
        "SAME_CATEGORY"
      );
    }

    const target = await prisma.category.findUnique({
      where: { id: options.targetCategoryId },
      select: { id: true },
    });
    if (!target) {
      throw new AppError("Catégorie de destination introuvable.", 400, "TARGET_NOT_FOUND");
    }

    const productCount = await getCategoryProductCount(categoryId);

    try {
      await prisma.$transaction([
        prisma.product.updateMany({
          where: { categoryId },
          data: { categoryId: options.targetCategoryId },
        }),
        prisma.category.delete({ where: { id: categoryId } }),
      ]);
    } catch (error: any) {
      if (error?.code === "P2025") {
        throw new AppError("Catégorie introuvable.", 404, "CATEGORY_NOT_FOUND");
      }
      console.error(`Database error reassigning products for category ${categoryId}:`, error);
      throw new AppError("Impossible de déplacer les produits.", 500);
    }

    return { deletedProductCount: 0, reassignedProductCount: productCount, imageUrls: [] };
  }

  // Cascade mode — collect image URLs *before* deleting, so we can clean
  // up Supabase Storage afterward.
  const productsInCategory = await prisma.product.findMany({
    where: { categoryId },
    select: { images: { select: { url: true } } },
  });
  const imageUrls = productsInCategory.flatMap((p) => p.images.map((img) => img.url));

  try {
    await prisma.$transaction([
      prisma.product.deleteMany({ where: { categoryId } }),
      prisma.category.delete({ where: { id: categoryId } }),
    ]);
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Catégorie introuvable.", 404, "CATEGORY_NOT_FOUND");
    }
    console.error(`Database error cascade-deleting category ${categoryId}:`, error);
    throw new AppError("Impossible de supprimer la catégorie.", 500);
  }

  return { deletedProductCount: productsInCategory.length, reassignedProductCount: 0, imageUrls };
}