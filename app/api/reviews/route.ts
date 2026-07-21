import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Schema matching the React component's form payload
const createReviewSchema = z.object({
  productId: z.string().min(1, "L'ID du produit est requis"),
  rating: z.number().min(1, "Veuillez sélectionner une note").max(5),
  reviewerName: z.string().optional().or(z.literal("")),
  comment: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")), // Honeypot field
});

/**
 * GET /api/reviews?productId=xyz
 * Fetches all reviews for a specific product
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "L'identifiant du produit est manquant" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        reviewerName: true, // Updated from `name`
        comment: true,
        createdAt: true,
      },
    });

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      reviewerName: r.reviewerName, // Updated from `r.name`
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ reviews: formattedReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews
 * Creates a new review for a product with auto-approval
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = createReviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { productId, rating, reviewerName, comment, website } = parsed.data;

    // Honeypot check
    if (website && website.trim() !== "") {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Ensure product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    // Save review to DB
    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        reviewerName: reviewerName?.trim() || null, // Updated from `name`
        comment: comment?.trim() || null,
        isApproved: true,
      },
    });

    return NextResponse.json(
      {
        review: {
          id: review.id,
          rating: review.rating,
          reviewerName: review.reviewerName, 
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la publication de votre avis." },
      { status: 500 }
    );
  }
}