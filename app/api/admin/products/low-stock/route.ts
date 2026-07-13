import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";

export async function GET() {
  try {
    // Authenticate Admin
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    // Define low stock threshold limit
    const LOW_STOCK_THRESHOLD = 20;

    // Pull products with stock lower than threshold
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: LOW_STOCK_THRESHOLD,
        },
        isPublished: true, // Only track active catalog inventory
      },
      select: {
        id: true,
        name: true,
        slug: true,
        stock: true,
      },
      orderBy: {
        stock: "asc", // Prioritize completely out-of-stock items first
      },
    });

    return NextResponse.json({ products: lowStockProducts });
  } catch (error: any) {
    console.error("Error fetching low stock notifications:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du stock" },
      { status: 500 }
    );
  }
}