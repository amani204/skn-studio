import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAdminReviews } from "@/lib/admin/reviews";


export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
   const reviews = await getAdminReviews();
    return NextResponse.json({ reviews }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/reviews error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les avis." },
      { status: 500 }
    );
  }
}