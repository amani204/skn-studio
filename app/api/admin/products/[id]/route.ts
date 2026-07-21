import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { updateProductSchema } from "@/lib/validation/product";
import { updateProduct, deleteProduct } from "@/lib/admin/products";
import { AppError } from "@/lib/errors";

const paramsSchema = z.object({ id: z.string().cuid("Identifiant de produit invalide.") });

// PUT /api/admin/products/[id] — update a product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Identifiant de produit invalide." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  try {
    const data = updateProductSchema.parse(body);
    const product = await updateProduct(parsedParams.data.id, data);
    return NextResponse.json({ product }, { status: 200 });
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
    console.error(`PUT /api/admin/products/${params.id} error:`, error);
    return NextResponse.json({ error: "Impossible de mettre à jour le produit." }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] — delete a product
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const parsedParams = paramsSchema.safeParse(params);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Identifiant de produit invalide." }, { status: 400 });
  }

  try {
    await deleteProduct(parsedParams.data.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    console.error(`DELETE /api/admin/products/${params.id} error:`, error);
    return NextResponse.json({ error: "Impossible de supprimer le produit." }, { status: 500 });
  }
}