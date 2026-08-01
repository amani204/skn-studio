import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/admin-auth";
import { getAllCategories } from "@/lib/admin/category";
import { CategoryManager } from "@/components/admin/category/CategoryManger";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/portal-97x-login");

  const categories = await getAllCategories();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header  */}
      <div className="border-b border-powder/40 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display tracking-tight text-ink sm:text-4xl">
            Catégories
          </h1>
          <p className="mt-1 text-sm text-ink/60 font-body">
            {categories.length} catégorie{categories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="text-xs font-medium uppercase tracking-widest text-navy/60 bg-navy/5 border border-navy/10 px-3.5 py-1.5 rounded-full whitespace-nowrap">
          {categories.length} total
        </div>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}