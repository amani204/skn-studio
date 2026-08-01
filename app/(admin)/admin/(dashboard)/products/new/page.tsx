import Link from "next/link";
import { getAllCategories } from "@/lib/admin/category";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { ArrowLeft, Sparkles } from "lucide-react";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getAllCategories();

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link
                    href="/admin/products"
                    className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors"
                    title="Retour"
                  >
                    <ArrowLeft className="w-5 h-5 text-neutral-600" />
                  </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
                Nouveau Produit
              </h1>
            </div>
            <p className="mt-1 text-sm text-ink/60 font-body">
              Ajoutez un nouveau produit à votre catalogue skin-care.
            </p>
          </div>
        </div>

        {/* Badge Indicator */}
        <div className="text-xs font-mono uppercase tracking-widest text-navy bg-navy/10 border border-navy/20 px-3.5 py-1.5 rounded-full w-fit">
          Catalogue
        </div>
      </div>

      {/* Form Container */}
      <ProductForm categories={categories} />
    </div>
  );
}