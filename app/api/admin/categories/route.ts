import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllCategories, createCategory } from "@/lib/admin/category";
import { createCategorySchema } from "@/lib/validation/category";
import { AppError } from "@/lib/errors";

// GET /api/admin/categories — list all categories (used by product form dropdown)
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const categories = await getAllCategories();
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories." },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories — create a category
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
    const data = createCategorySchema.parse(body);
    const category = await createCategory(data);
    return NextResponse.json({ category }, { status: 201 });
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
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json({ error: "Impossible de créer la catégorie." }, { status: 500 });
  }
}