import "server-only";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { AppError } from "@/lib/errors";
import type { CreateCategoryInput } from "@/lib/validation/category";

/**
 * Fetches all categories, including a product count (useful for the
 * dashboard and for warning admins before they delete a non-empty category).
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