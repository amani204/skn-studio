import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";

type RouteParams = { params: Promise<{ id: string }> };

const toggleSchema = z.object({
  isApproved: z.boolean(),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Check if the user is an admin
    const session = await requireAdmin();
    
    // If session is null, they are NOT an admin -> Return 403 Forbidden
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = toggleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: parsed.data.isApproved },
    });

    return NextResponse.json({ review: updated });
  } catch (error: any) {
    console.error("Error in PATCH /api/review:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Check if the user is an admin
    const session = await requireAdmin();
    
    // If session is null, they are NOT an admin -> Return 403 Forbidden
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.review.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/review:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}