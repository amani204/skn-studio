import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { productSchema } from "@/lib/validation/admin";
import { getAdminProducts, getFeaturedIconCount } from "@/lib/admin/products";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const lowStockOnly = req.nextUrl.searchParams.get("lowStock") === "true";
  const products = await getAdminProducts({ lowStockOnly });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Enforce max 4 featured icons server-side — never trust the UI alone to prevent this
  if (data.isFeatured) {
    const count = await getFeaturedIconCount();
    if (count >= 4) {
      return NextResponse.json(
        { error: "Maximum 4 produits en vedette. Retirez-en un avant d'en ajouter un autre." },
        { status: 409 }
      );
    }
  }

  // Slug must be unique — check explicitly for a clear error instead of a raw DB constraint crash
  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 409 });
  }

  // Images are handled separately from the validated schema (they're uploaded
  // beforehand via /api/admin/upload, this route just links the resulting URLs).
  const images = Array.isArray(body?.images)
    ? (body.images as { url: string; alt?: string }[]).filter(
        (img) => typeof img?.url === "string" && img.url.length > 0
      )
    : [];

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      oldPrice: data.oldPrice ?? null,
      stock: data.stock,
      categoryId: data.categoryId,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured ?? false,
      images: images.length
        ? {
            create: images.map((img, index) => ({
              url: img.url,
              alt: img.alt ?? null,
              order: index,
            })),
          }
        : undefined,
    },
    include: { images: true, category: true },
  });

  return NextResponse.json({ product }, { status: 201 });
}