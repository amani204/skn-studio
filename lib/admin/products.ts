import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Fetches all products from the database, ordered by creation date.
 */
export async function getAllProducts() {
  try {
    return await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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
      where: {
        stock: {
          lte: threshold,
        },
      },
      orderBy: {
        stock: "asc", // Show completely out-of-stock items first
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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
        images: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  } catch (error) {
    console.error(`Database error in getProductById for ID ${id}:`, error);
    throw new Error("Impossible de récupérer les détails du produit.");
  }
}