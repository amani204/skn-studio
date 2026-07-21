// app/api/admin/reviews/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { deleteReview } from "@/lib/admin/reviews";

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {

  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteReview(id);
    return NextResponse.json({ message: "Avis supprimé." });
  } catch (error: any) {
    const status = error.statusCode || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}