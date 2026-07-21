import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { deliveryRateSchema } from "@/lib/validation/admin";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const isAdmin = await requireAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { error: "Corps de la requête invalide ou vide" },
        { status: 400 }
      );
    }

    const parsed = deliveryRateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Direct update with Prisma P2025 error handling if record doesn't exist
    const rate = await prisma.deliveryRate.update({
      where: { id },
      data: {
        homePrice: parsed.data.homePrice,
        deskPrice: parsed.data.deskPrice,
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
    console.error("Erreur lors de la mise à jour du tarif de livraison:", error);

    // Prisma error code for Record to update not found
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Tarif de livraison introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}