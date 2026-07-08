import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ==================== GET /api/reviews?productId=xxx ====================
// Client: Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // ✅ Show ONLY approved reviews (auto-approved on creation)
    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        rating: true,
        reviewerName: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      reviews,
      total: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ==================== POST /api/reviews ====================
// Client: Submit a review (auto-approved)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, reviewerName, comment, website } = body;

    // Honeypot check (bot protection)
    if (website) {
      return NextResponse.json(
        { message: "Review submitted successfully" },
        { status: 200 }
      );
    }

    // Validation
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Create review with isApproved = true (auto-approved for clients)
    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        reviewerName: reviewerName?.trim() || undefined,
        comment: comment?.trim() || undefined,
        isApproved: true, // ← Auto-approved!
      },
    });

    return NextResponse.json(
      {
        message: "Review submitted successfully",
        review: {
          id: review.id,
          rating: review.rating,
          reviewerName: review.reviewerName,
          comment: review.comment,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}