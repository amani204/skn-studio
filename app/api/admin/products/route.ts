import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/admin/products";
import { requireAdmin } from "@/lib/admin/admin-auth";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}