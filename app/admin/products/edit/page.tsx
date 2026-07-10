import { notFound } from "next/navigation";
import { getAdminProductById, getCategoriesForAdmin } from "@/lib/admin/products";
import ProductForm from "@/components/admin/products/ProductForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProductById(id),
    getCategoriesForAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Modifier le produit</h1>
      <ProductForm categories={categories}  />
    </div>
  );
}