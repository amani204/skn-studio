import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { orderStatusSchema } from "@/lib/validation/admin";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = orderStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const newStatus = parsed.data.status;

  const existingOrder = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!existingOrder) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const isBeingCancelled = newStatus === "CANCELLED" && existingOrder.status !== "CANCELLED";

  const order = await prisma.$transaction(async (tx) => {
    // Restore stock when cancelling — otherwise every cancellation
    // permanently shrinks inventory for no reason.
    if (isBeingCancelled) {
      await Promise.all(
        existingOrder.items
          .filter((item) => item.productId) // skip items whose product was later deleted
          .map((item) =>
            tx.product.update({
              where: { id: item.productId! },
              data: { stock: { increment: item.quantity } },
            })
          )
      );
    }

    return tx.order.update({
      where: { id },
      data: { status: newStatus },
    });
  });

  return NextResponse.json({ success: true, order });
}