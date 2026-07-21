import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllProducts } from "@/lib/admin/products";

// GET /api/admin/products — list all products (dashboard table)
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const products = await getAllProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les produits." },
      { status: 500 }
    );
  }
}