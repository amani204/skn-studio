// path: app/admin/products/new/page.tsx
import Link from "next/link";
import { getAllCategories } from "@/lib/admin/category";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAllCategories();

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-neutral-200/80 pb-5">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
          title="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-neutral-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Nouveau Produit</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Ajoutez un nouveau produit à votre catalogue skin-care.
          </p>
        </div>
      </div>

      {/* Form */}
      <ProductForm categories={categories} />
    </div>
  );
}