import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { createProductSchema } from "@/lib/validation/product";
import { createProduct } from "@/lib/admin/products";
import { AppError } from "@/lib/errors";

// POST /api/admin/products/new — create a product (with its images)
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  try {
    const data = createProductSchema.parse(body);
    const product = await createProduct(data);
    return NextResponse.json({ product }, { status: 201 });
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
    console.error("POST /api/admin/products/new error:", error);
    return NextResponse.json({ error: "Impossible de créer le produit." }, { status: 500 });
  }
}