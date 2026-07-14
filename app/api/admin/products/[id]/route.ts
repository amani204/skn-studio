import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";

type Context = {
  params: { id: string };
};

/**
 * PUT /api/admin/product/[id]
 * Updates a specific product's primary details
 */
export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();

    // Generate clean slug if the name changed
    let slugData = {};
    if (body.name) {
      const cleanSlug = body.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      slugData = { slug: cleanSlug };
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: body.price !== undefined ? parseFloat(body.price) : undefined,
        stock: body.stock !== undefined ? parseInt(body.stock, 10) : undefined,
        isPublished: body.isPublished !== undefined ? body.isPublished : undefined,
        ...slugData
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error(`Error updating product [ID: ${params.id}]:`, error);
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/product/[id]
 * Deletes a product permanently from the database
 */
export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting product [ID: ${params.id}]:`, error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}