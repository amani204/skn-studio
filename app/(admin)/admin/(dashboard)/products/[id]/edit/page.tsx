// path: app/[lang]/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/products/ProductForm";

interface EditProductPageProps {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  // Convert Prisma Decimal fields to numbers for client components
  const formattedProduct = {
    ...product,
    price: Number(product.price),
    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Modifier: {product.name}
        </h1>
        <p className="text-sm text-neutral-500">
          Mettez à jour les informations, prix ou images du produit.
        </p>
      </div>

      <ProductForm categories={categories} initialData={formattedProduct} />
    </div>
  );
}