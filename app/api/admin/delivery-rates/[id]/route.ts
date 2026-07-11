import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { deliveryRateSchema } from "@/lib/validation/admin";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = deliveryRateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.deliveryRate.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Wilaya introuvable" }, { status: 404 });
  }

  const rate = await prisma.deliveryRate.update({
    where: { id },
    data: {
      homePrice: parsed.data.homePrice,
      deskPrice: parsed.data.deskPrice,
      isActive: parsed.data.isActive ?? existing.isActive,
    },
  });

  return NextResponse.json({
    rate: {
      ...rate,
      homePrice: Number(rate.homePrice),
      deskPrice: Number(rate.deskPrice),
    },
  });
}