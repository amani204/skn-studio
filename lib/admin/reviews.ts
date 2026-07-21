import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

/**
 * Fetches all reviews with their associated product details for the admin table.
 */
export async function getAdminReviews() {
  try {
    return await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        reviewerName: true,
        comment: true,
        createdAt: true,
        isApproved: true,
        product: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  } catch (error) {
    console.error("Database error in getAdminReviews:", error);
    throw new AppError("Impossible de récupérer les avis.", 500);
  }
}

/**
 * Deletes a review by its unique ID.
 */
export async function deleteReview(id: string) {
  try {
    return await prisma.review.delete({
      where: { id },
    });
  } catch (error: any) {
    if (error?.code === "P2025") {
      throw new AppError("Avis introuvable.", 404, "REVIEW_NOT_FOUND");
    }
    console.error(`Database error in deleteReview for ID ${id}:`, error);
    throw new AppError("Impossible de supprimer l'avis.", 500);
  }
}