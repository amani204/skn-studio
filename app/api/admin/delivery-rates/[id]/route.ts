import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { deliveryRateSchema } from "@/lib/validation/admin";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    // Correct Auth Check
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = deliveryRateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Direct Update (Avoids double database hit)
    const rate = await prisma.deliveryRate.update({
      where: { id },
      data: {
        homePrice: parsed.data.homePrice,
        deskPrice: parsed.data.deskPrice,
        // Using undefined here tells Prisma to skip updating it if it's not provided,
        // which completely eliminates the need for the previous 'existing' check.
        isActive: parsed.data.isActive ?? undefined, 
      },
    });

    return NextResponse.json({
      rate: {
        ...rate,
        homePrice: Number(rate.homePrice),
        deskPrice: Number(rate.deskPrice),
      },
    });
  } catch (error: any) {
    console.error("Error in PATCH delivery rate:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Wilaya introuvable" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}