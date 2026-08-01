import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/admin-auth";
import {
  getCategoryProductCount,
  getOtherCategories,
  deleteCategory,
} from "@/lib/admin/category";
import { supabase as supabaseAdmin } from "@/lib/admin/supabase-storage";
import { AppError } from "@/lib/errors";

const paramsSchema = z.object({ id: z.string().cuid("Identifiant de catégorie invalide.") });

const deleteBodySchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("cascade") }),
  z.object({ mode: z.literal("reassign"), targetCategoryId: z.string().cuid() }),
]);

const BUCKET = "product-images"; // must match the bucket used in uploadProductImage

/** Turns a Supabase public URL back into the path `remove()` expects. */
function toStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  return publicUrl.slice(index + marker.length);
}

// DELETE /api/admin/categories/[id]
//
// - Empty category: deletes immediately, no body needed.
// - Category has products, no body sent: returns 409 with the product
//   count and the list of other categories, so the frontend can show a
//   choice dialog (reassign vs. delete everything) without a second
//   round trip to fetch category options.
// - Category has products, body sent: { mode: "cascade" } or
//   { mode: "reassign", targetCategoryId } — carries out that decision.
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const resolvedParams = await params;
  const parsedParams = paramsSchema.safeParse(resolvedParams);
  if (!parsedParams.success) {
    return NextResponse.json({ error: "Identifiant de catégorie invalide." }, { status: 400 });
  }
  const categoryId = parsedParams.data.id;

  // A plain `fetch(url, { method: "DELETE" })` with no body is valid and
  // means "no decision made yet" — don't treat it as a parse error.
  let rawBody: unknown = null;
  try {
    const text = await req.text();
    rawBody = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json({ error: "Corps de requête JSON invalide." }, { status: 400 });
  }

  try {
    const productCount = await getCategoryProductCount(categoryId);

    if (productCount === 0) {
      await deleteCategory(categoryId, { mode: "cascade" });
      return NextResponse.json({ success: true, deletedProductCount: 0 }, { status: 200 });
    }

    if (!rawBody) {
      const otherCategories = await getOtherCategories(categoryId);
      return NextResponse.json(
        {
          error: `Cette catégorie contient ${productCount} produit(s). Choisissez une action.`,
          code: "CATEGORY_HAS_PRODUCTS",
          productCount,
          otherCategories,
        },
        { status: 409 }
      );
    }

    const body = deleteBodySchema.parse(rawBody);
    const result = await deleteCategory(categoryId, body);

    // Best-effort Supabase Storage cleanup — only relevant in cascade mode.
    // Runs after the DB transaction already succeeded, so a failure here
    // never turns into an error response; it's just logged for manual cleanup.
    if (result.imageUrls.length > 0) {
      const paths = result.imageUrls.map(toStoragePath).filter((p): p is string => Boolean(p));
      if (paths.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage.from(BUCKET).remove(paths);
        if (storageError) {
          console.error("Storage cleanup failed after category deletion:", storageError);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        deletedProductCount: result.deletedProductCount,
        reassignedProductCount: result.reassignedProductCount,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides.", details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error(`DELETE /api/admin/categories/${categoryId} error:`, error);
    return NextResponse.json({ error: "Impossible de supprimer la catégorie." }, { status: 500 });
  }
}