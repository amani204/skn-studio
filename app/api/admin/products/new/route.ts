import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, oldPrice, stock, categoryId, isPublished, isFeatured } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    // Generate a URL-safe unique slug from the product name
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: uniqueSlug,
        description,
        price: parseFloat(price),
        oldPrice: oldPrice ? parseFloat(oldPrice) : null,
        stock: parseInt(stock, 10) || 0,
        categoryId,
        isPublished: isPublished !== undefined ? isPublished : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
      },
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}