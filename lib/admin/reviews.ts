

import "server-only";
import { prisma } from "@/lib/prisma";

export async function getAdminReviews() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return reviews;
}