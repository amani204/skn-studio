import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { updateOrderStatusSchema } from "@/lib/validation/order";
import { updateOrderStatus } from "@/lib/admin/order";
import { AppError } from "@/lib/errors";

const paramsSchema = z.object({ id: z.string().cuid("Identifiant de commande invalide.") });

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params  // ← await

  const parsedParams = paramsSchema.safeParse({ id })
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Identifiant de commande invalide." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  try {
    const { status } = updateOrderStatusSchema.parse(body);
    const order = await updateOrderStatus(parsedParams.data.id, status);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Données invalides.", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`PATCH /api/admin/orders/${id} error:`, error);
    return NextResponse.json({ error: "Impossible de mettre à jour la commande." }, { status: 500 });
  }
}