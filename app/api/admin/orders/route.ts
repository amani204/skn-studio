import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllOrders } from "@/lib/admin/order";

// list all orders with items + shipping address
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les commandes." },
      { status: 500 }
    );
  }
}