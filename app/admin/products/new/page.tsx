import { getCategoriesForAdmin } from "@/lib/admin/products";
import ProductForm from "@/components/admin/products/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategoriesForAdmin();

  return (
    <div className="p-8">
      <h1 className="mb-6 font-display text-2xl text-ink">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}