import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminDeliveryRates } from "@/lib/admin/delivery-rates";

export async function GET() {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json(
      { error: "Accès non autorisé" },
      { status: 401 }
    );
  }

  try {
    const rates = await getAdminDeliveryRates();
    return NextResponse.json({ rates });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des tarifs de livraison" },
      { status: 500 }
    );
  }
}