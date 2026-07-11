import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";

type RouteParams = { params: Promise<{ id: string }> };

const toggleSchema = z.object({
  isApproved: z.boolean(),
});

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = toggleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { isApproved: parsed.data.isApproved },
  });

  return NextResponse.json({ review: updated });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: "Avis introuvable" }, { status: 404 });
  }

  await prisma.review.delete({ where: { id } });

  return NextResponse.json({ success: true });
}