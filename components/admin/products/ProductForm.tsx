// path: components/admin/products/ProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductImage {
  id?: string;
  url: string;
  alt: string | null;
  order?: number;
}

interface ProductInitialData {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  categoryId: string;
  isPublished: boolean;
  isFeatured: boolean;
  images: ProductImage[];
}

interface ProductFormProps {
  categories: Category[];
  initialData?: ProductInitialData | null;
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields - Pre-populated if initialData exists
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState<string>(
    initialData?.price !== undefined ? String(initialData.price) : ""
  );
  const [oldPrice, setOldPrice] = useState<string>(
    initialData?.oldPrice !== null && initialData?.oldPrice !== undefined
      ? String(initialData.oldPrice)
      : ""
  );
  const [stock, setStock] = useState<string>(
    initialData?.stock !== undefined ? String(initialData.stock) : "0"
  );
  const [categoryId, setCategoryId] = useState<string>(
    initialData?.categoryId || categories[0]?.id || ""
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished ?? true
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured ?? false
  );

  // Images state
  const [images, setImages] = useState<{ url: string; alt: string }[]>(
    initialData?.images
      ? [...initialData.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((img) => ({
          url: img.url,
          alt: img.alt ?? initialData.name,
        }))
      : []
  );
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Cloudinary Upload
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary environment variables missing.");
      return;
    }

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setImages((prev) => [...prev, { url: data.secure_url, alt: name || "Product image" }]);
      } else {
        throw new Error("Upload failed.");
      }
    } catch (err: any) {
      setError(err.message || "Error uploading image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddUrlImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, { url: imageUrlInput.trim(), alt: name || "Product image" }]);
    setImageUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (images.length === 0) {
      setError("Veuillez ajouter au moins une image (Principale).");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      stock: parseInt(stock, 10),
      categoryId,
      isPublished,
      isFeatured,
      images: images.map((img, idx) => ({
        url: img.url,
        alt: img.alt || name,
        order: idx,
      })),
    };

    try {
      const endpoint = isEditing
        ? `/api/admin/products/${initialData?.id}`
        : "/api/admin/products/new";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Une erreur est survenue.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900">
            {isEditing ? "Modifier le produit" : "Informations générales"}
          </h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Nom du produit *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Crème Hydratante Apaisante"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description détaillée du produit..."
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Prix (DA) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="2500"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Ancien Prix (DA)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="3200 (optionnel)"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-neutral-900">Organisation</h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Catégorie *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4 pt-2 border-t border-neutral-100">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-neutral-700">Publié</span>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-neutral-700">En vedette</span>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Images du produit *</h2>
          <p className="text-xs text-neutral-500 mt-1">
            Image 1: Principale • Image 2: Hover (optionnel) • Images 3+: Galerie
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-neutral-50/50">
            {uploadingImage ? (
              <Loader2 className="w-6 h-6 animate-spin text-neutral-500 my-2" />
            ) : (
              <UploadCloud className="w-6 h-6 text-neutral-500 mb-1" />
            )}
            <span className="text-sm font-medium text-neutral-800">
              {uploadingImage ? "Téléversement..." : "Téléverser via Cloudinary"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCloudinaryUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          <div className="border border-neutral-200 rounded-xl p-4 flex flex-col justify-between bg-neutral-50/30">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Lien URL
            </span>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;
              const isSecondary = idx === 1;

              return (
                <div
                  key={idx}
                  className={`relative group border rounded-xl overflow-hidden bg-neutral-100 flex flex-col justify-between p-2 aspect-square transition-all ${
                    isPrimary
                      ? "ring-2 ring-neutral-900 border-transparent shadow-sm"
                      : isSecondary
                      ? "ring-2 ring-amber-500/80 border-transparent"
                      : "border-neutral-200"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover -z-0"
                  />

                  <div className="relative z-10 flex items-start justify-between w-full">
                    {isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-1 rounded-md shadow-sm">
                        1. Principale
                      </span>
                    )}
                    {isSecondary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 2. Hover
                      </span>
                    )}
                    {!isPrimary && !isSecondary && (
                      <span className="text-[10px] font-semibold bg-neutral-900/70 text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
                        {idx + 1}. Galerie
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="relative z-10 flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/60 backdrop-blur-md p-1 rounded-lg">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, idx - 1)}
                      className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-white/90 font-medium">Réordonner</span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveImage(idx, idx + 1)}
                      className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-sm font-medium transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Mettre à jour" : "Enregistrer le produit"}
        </button>
      </div>
    </form>
  );
}