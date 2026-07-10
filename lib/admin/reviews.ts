import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminReviews() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true, slug: true } } },
  });

  return reviews.map((r) => ({
    id: r.id,
    productName: r.product.name,
    productSlug: r.product.slug,
    reviewerName: r.reviewerName ?? "Anonyme",
    rating: r.rating,
    comment: r.comment,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
  }));
}