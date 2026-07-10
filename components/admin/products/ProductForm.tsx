"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, { ProductImageData } from "./ImagerUploader";

type Category = { id: string; name: string };

type ProductFormProps = {
  categories: Category[];
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    categoryId: string;
    isPublished: boolean;
    isFeatured: boolean;
    images: { url: string; alt: string | null }[];
  };
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [oldPrice, setOldPrice] = useState(initialData?.oldPrice?.toString() ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "0");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? categories[0]?.id ?? "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeaturedIcon] = useState(initialData?.isFeatured ?? false);
  const [images, setImages] = useState<ProductImageData[]>(
    initialData?.images.map((img) => ({ url: img.url, alt: img.alt ?? undefined })) ?? []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      stock: Number(stock),
      categoryId,
      isPublished,
      isFeatured,
      images,
    };

    try {
      const url = isEditing ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Une erreur est survenue");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Nom</label>
        <input
          type="text"
          required
          maxLength={200}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Slug</label>
        <input
          type="text"
          required
          maxLength={200}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugManuallyEdited(true);
          }}
          className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Description</label>
        <textarea
          required
          rows={5}
          maxLength={5000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-none rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Prix (DA)</label>
          <input
            type="number"
            required
            min={0}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">
            Ancien prix (optionnel)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Stock</label>
          <input
            type="number"
            required
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Catégorie</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-powder/40 px-4 py-2.5 text-sm text-ink focus:border-navy/30 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUploader images={images} onChange={setImages} />

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="accent-navy"
          />
          Publié (visible sur la boutique)
        </label>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeaturedIcon(e.target.checked)}
            className="accent-navy"
          />
          Afficher dans &quot;Nos Icônes&quot; (max 4 produits)
        </label>
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-navy px-6 py-3 text-sm font-medium text-white hover:bg-navy/80 disabled:opacity-50"
      >
        {isSubmitting ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le produit"}
      </button>
    </form>
  );
}