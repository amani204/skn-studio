import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getLowStockProducts } from "@/lib/admin/products";

// GET /api/admin/products/low-stock?threshold=20
export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const thresholdParam = searchParams.get("threshold");
  const threshold = thresholdParam ? Number(thresholdParam) : 20;

  if (!Number.isFinite(threshold) || threshold < 0) {
    return NextResponse.json({ error: "Seuil invalide." }, { status: 400 });
  }

  try {
    const products = await getLowStockProducts(threshold);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/products/low-stock error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les produits en stock faible." },
      { status: 500 }
    );
  }
}