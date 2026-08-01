"use client";

import { useState } from "react";
import { Plus, Trash2, FolderOpen, AlertTriangle, Loader2, ArrowRightLeft } from "lucide-react";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

interface OtherCategory {
  id: string;
  name: string;
}

interface CategoryManagerProps {
  categories: CategoryWithCount[];
}

type PendingDelete = {
  category: CategoryWithCount;
  otherCategories: OtherCategory[];
};

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [deleteMode, setDeleteMode] = useState<"reassign" | "cascade">("reassign");
  const [targetCategoryId, setTargetCategoryId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingSilentlyId, setDeletingSilently] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Impossible de créer la catégorie.");
      }

      setCategories((prev) =>
        [...prev, { ...data.category, _count: { products: 0 } }].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      setName("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Impossible de créer la catégorie.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClick = async (category: CategoryWithCount) => {
    setDeleteError(null);

    if (category._count.products === 0) {
      setDeletingSilently(category.id);
      try {
        const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Impossible de supprimer la catégorie.");
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : "Impossible de supprimer la catégorie.");
      } finally {
        setDeletingSilently(null);
      }
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      const data = await res.json();

      if (res.status === 409 && data.code === "CATEGORY_HAS_PRODUCTS") {
        const otherCategories: OtherCategory[] = data.otherCategories ?? [];
        setPendingDelete({ category, otherCategories });
        setDeleteMode(otherCategories.length > 0 ? "reassign" : "cascade");
        setTargetCategoryId(otherCategories[0]?.id ?? "");
        return;
      }

      if (!res.ok) throw new Error(data?.error ?? "Impossible de supprimer la catégorie.");
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Impossible de supprimer la catégorie.");
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    if (deleteMode === "reassign" && !targetCategoryId) {
      setDeleteError("Choisissez une catégorie de destination.");
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/categories/${pendingDelete.category.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          deleteMode === "cascade"
            ? { mode: "cascade" }
            : { mode: "reassign", targetCategoryId }
        ),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Impossible de supprimer la catégorie.");
      }

      setCategories((prev) => {
        const withoutDeleted = prev.filter((c) => c.id !== pendingDelete.category.id);
        if (deleteMode === "reassign" && data.reassignedProductCount > 0) {
          return withoutDeleted.map((c) =>
            c.id === targetCategoryId
              ? { ...c, _count: { products: c._count.products + data.reassignedProductCount } }
              : c
          );
        }
        return withoutDeleted;
      });
      setPendingDelete(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Impossible de supprimer la catégorie.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create category form  */}
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-3 rounded-lg border border-powder/40 bg-white p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label htmlFor="category-name" className="mb-1.5 block text-xs font-medium text-ink/60">
            Nouvelle catégorie
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex. Soins visage"
            className="w-full rounded-lg border border-powder/40 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
          />
        </div>
        <button
          type="submit"
          disabled={isCreating || !name.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Ajouter
        </button>
      </form>

      {/* Error messages */}
      {createError && <p className="text-sm text-rose-500">{createError}</p>}
      {deleteError && !pendingDelete && <p className="text-sm text-rose-500">{deleteError}</p>}

      {/* Category list  */}
      <div className="overflow-hidden rounded-lg border border-powder/40 bg-white">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 stroke-1 text-ink/30" />
            <p className="font-medium text-ink/70">Aucune catégorie</p>
            <p className="text-xs text-ink/40 mt-0.5">
              Créez votre première catégorie en utilisant le formulaire ci-dessus.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-powder/20">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-powder/5 transition-colors"
              >
                <div>
                  <p className="font-medium text-ink">{category.name}</p>
                  <p className="text-xs text-ink/50">
                    {category._count.products} produit{category._count.products !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteClick(category)}
                  disabled={deletingSilentlyId === category.id}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 disabled:opacity-50 transition-colors"
                >
                  {deletingSilentlyId === category.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} strokeWidth={1.5} />
                  )}
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirmation modal  */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-powder/20">
            <div className="mb-3 flex items-center gap-2 text-amber-600">
              <AlertTriangle size={20} strokeWidth={1.5} />
              <h2 className="font-display text-base">Supprimer « {pendingDelete.category.name} »</h2>
            </div>
            <p className="mb-4 text-sm text-ink/70">
              Cette catégorie contient{" "}
              <strong>
                {pendingDelete.category._count.products} produit
                {pendingDelete.category._count.products !== 1 ? "s" : ""}
              </strong>
              . Que voulez-vous faire ?
            </p>

            <div className="mb-4 space-y-2">
              {pendingDelete.otherCategories.length > 0 && (
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-powder/30 p-3 has-[:checked]:border-navy/40 has-[:checked]:bg-navy/5">
                  <input
                    type="radio"
                    name="delete-mode"
                    checked={deleteMode === "reassign"}
                    onChange={() => setDeleteMode("reassign")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                      <ArrowRightLeft size={14} strokeWidth={1.5} />
                      Déplacer les produits
                    </p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      Les produits sont conservés et déplacés vers une autre catégorie.
                    </p>
                    {deleteMode === "reassign" && (
                      <select
                        value={targetCategoryId}
                        onChange={(e) => setTargetCategoryId(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-powder/40 bg-white px-2.5 py-1.5 text-sm text-ink focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
                      >
                        {pendingDelete.otherCategories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </label>
              )}

              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-powder/30 p-3 has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50">
                <input
                  type="radio"
                  name="delete-mode"
                  checked={deleteMode === "cascade"}
                  onChange={() => setDeleteMode("cascade")}
                  className="mt-0.5"
                />
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600">
                    <Trash2 size={14} strokeWidth={1.5} />
                    Tout supprimer
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    Supprime définitivement les produits, leurs images et leurs avis. Les
                    commandes déjà passées ne sont pas affectées. Irréversible.
                  </p>
                </div>
              </label>
            </div>

            {deleteError && <p className="mb-3 text-sm text-rose-500">{deleteError}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={isDeleting}
                className="rounded-lg px-4 py-2 text-sm font-medium text-ink/60 hover:bg-powder/10"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${
                  deleteMode === "cascade" ? "bg-rose-500 hover:bg-rose-600" : "bg-navy hover:opacity-90"
                }`}
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                {deleteMode === "cascade" ? "Tout supprimer" : "Déplacer et supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}