import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { productSchema } from "@/lib/validation/admin";
import { getFeaturedIconCount } from "@/lib/admin/products";
import { deleteProductImage } from "@/lib/admin/upload";

type RouteParams = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const existingProduct = await prisma.product.findUnique({ where: { id } });
  if (!existingProduct) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  // Slug uniqueness check, excluding this product itself
  if (data.slug !== existingProduct.slug) {
    const slugTaken = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (slugTaken) {
      return NextResponse.json({ error: "Ce slug est déjà utilisé" }, { status: 409 });
    }
  }

  // Enforce max 4 featured icons, excluding this product from the count
  // (so re-saving an already-featured product doesn't false-positive)
  if (data.isFeatured && !existingProduct.isFeatured) {
    const count = await getFeaturedIconCount(id);
    if (count >= 4) {
      return NextResponse.json(
        { error: "Maximum 4 produits en vedette. Retirez-en un avant d'en ajouter un autre." },
        { status: 409 }
      );
    }
  }

  const images = Array.isArray(body?.images)
    ? (body.images as { url: string; alt?: string }[]).filter(
        (img) => typeof img?.url === "string" && img.url.length > 0
      )
    : undefined;

  const product = await prisma.$transaction(async (tx) => {
    if (images) {
      await tx.productImage.deleteMany({ where: { productId: id } });
    }

    return tx.product.update({
      where: { id },
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
        ...(images
          ? {
              images: {
                create: images.map((img, index) => ({
                  url: img.url,
                  alt: img.alt ?? null,
                  order: index,
                })),
              },
            }
          : {}),
      },
      include: { images: true, category: true },
    });
  });

  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  // Delete the DB row first — safe even if the product has existing orders,
  // since OrderItem.productId is nullable with onDelete: SetNull (schema fix).
  // Order history keeps productName/price as its own snapshot regardless.
  await prisma.product.delete({ where: { id } });

  // Clean up storage files after the DB delete succeeds — non-fatal if this fails
  for (const image of product.images) {
    await deleteProductImage(image.url);
  }

  return NextResponse.json({ success: true });
}