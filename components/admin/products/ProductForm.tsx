
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Trash2,
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
  Plus,
  Image as ImageIcon,
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
      ? [...initialData.images]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((img) => ({
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
      setError("Les variables d'environnement Cloudinary sont manquantes.");
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
        setImages((prev) => [...prev, { url: data.secure_url, alt: name || "Image produit" }]);
      } else {
        throw new Error("Échec du téléversement.");
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du téléversement de l'image.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddUrlImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, { url: imageUrlInput.trim(), alt: name || "Image produit" }]);
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50/90 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: General Information */}
        <div className="lg:col-span-2 space-y-6 bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-powder/50 shadow-sm">
          <div className="border-b border-powder/40 pb-4">
            <h2 className="text-xl font-display font-medium text-ink">
              {isEditing ? "Modifier le produit" : "Informations générales"}
            </h2>
            <p className="text-xs text-ink/50 mt-1 font-body">
              Entrez le nom, la description et les données tarifaires.
            </p>
          </div>

          <div className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Crème Hydratante Apaisante"
                className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white/50 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-xs"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description détaillée du produit..."
                className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white/50 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all resize-y shadow-xs"
              />
            </div>

            {/* Prices & Stock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                  Prix (DZD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white/50 font-medium text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                  Ancien Prix (DZD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="3200"
                  className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white/50  font-medium  text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white/50 font-medium text-sm text-ink focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Settings */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-powder/50 shadow-sm space-y-6">
            <div className="border-b border-powder/40 pb-4">
              <h2 className="text-xl font-display font-medium text-ink">
                Organisation
              </h2>
              <p className="text-xs text-ink/50 mt-1 font-body">
                Catégorie et état de publication
              </p>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-2">
                Catégorie *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-powder/60 bg-white text-sm text-ink focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all shadow-xs cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggles */}
            <div className="space-y-4 pt-4 border-t border-powder/30">
              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-ink block">
                    Publié
                  </span>
                  <span className="text-xs text-ink/50">
                    Visible sur la boutique
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-powder text-navy focus:ring-navy/20 cursor-pointer accent-navy"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <div>
                  <span className="text-sm font-medium text-ink block">
                    En vedette
                  </span>
                  <span className="text-xs text-ink/50">
                    Mettre en avant sur l'accueil
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-powder text-navy focus:ring-navy/20 cursor-pointer accent-navy"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Image Upload Gallery Card */}
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-powder/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-powder/40 pb-4">
          <div>
            <h2 className="text-xl font-display font-medium text-ink">
              Galerie Médias *
            </h2>
            <p className="text-xs text-ink/50 mt-1 font-body">
              Image 1: Principale • Image 2: Survol (optionnel) • Images 3+: Galerie
            </p>
          </div>

          <div className="text-xs font-medium bg-powder/20 text-navy px-3 py-1 rounded-full w-fit">
            {images.length} {images.length > 1 ? "images" : "image"}
          </div>
        </div>

        {/* Upload Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Cloudinary Dropzone */}
          <label className="border-2 border-dashed border-powder hover:border-navy/60 rounded-lg p-5 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-cream/30 group">
            {uploadingImage ? (
              <Loader2 className="w-6 h-6 animate-spin text-navy my-2" />
            ) : (
              <UploadCloud className="w-6 h-6 text-ink/40 group-hover:text-navy transition-colors mb-2" />
            )}
            <span className="text-sm font-medium text-ink">
              {uploadingImage ? "Téléversement..." : "Téléverser via Cloudinary"}
            </span>
            <span className="text-[11px] text-ink/40 mt-0.5">
              PNG, JPG, WEBP jusqu'à 10 Mo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleCloudinaryUpload}
              disabled={uploadingImage}
              className="hidden"
            />
          </label>

          {/* External URL Input */}
          <div className="border border-powder/60 rounded-lg p-5 flex flex-col justify-between bg-cream/20">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-ink/70 mb-1">
                Lien URL externe
              </span>
              <p className="text-[11px] text-ink/40 mb-3">
                Ajoutez directement une image via son adresse web.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-powder/60 bg-white text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
              />
              <button
                type="button"
                onClick={handleAddUrlImage}
                className="px-3.5 py-2 bg-navy text-white hover:bg-navy/90 rounded-lg text-xs font-medium transition-colors inline-flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4 border-t border-powder/30">
            {images.map((img, idx) => {
              const isPrimary = idx === 0;
              const isSecondary = idx === 1;

              return (
                <div
                  key={idx}
                  className={`relative group rounded-lg overflow-hidden bg-cream border flex flex-col justify-between p-2.5 aspect-square transition-all isolate ${
                    isPrimary
                      ? "border-navy ring-2 ring-navy/20 shadow-sm"
                      : isSecondary
                      ? "border-amber-400 ring-2 ring-amber-400/20"
                      : "border-powder/60"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover -z-10"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Header Badges */}
                  <div className="relative z-10 flex items-start justify-between w-full">
                    {isPrimary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-navy text-white px-2 py-0.5 rounded-md shadow-xs">
                        1. Principale
                      </span>
                    )}
                    {isSecondary && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 2. Hover
                      </span>
                    )}
                    {!isPrimary && !isSecondary && (
                      <span className="text-[10px] font-semibold bg-ink/70 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
                        {idx + 1}. Galerie
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ml-auto shadow-xs"
                      title="Supprimer l'image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Reorder Toolbar */}
                  <div className="relative z-10 flex items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity bg-ink/80 backdrop-blur-md p-1 rounded-lg">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveImage(idx, idx - 1)}
                      className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded transition-colors"
                      title="Déplacer vers la gauche"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-white/90 font-medium">
                      {idx + 1} / {images.length}
                    </span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveImage(idx, idx + 1)}
                      className="p-1 text-white disabled:opacity-30 hover:bg-white/20 rounded transition-colors"
                      title="Déplacer vers la droite"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 border border-dashed border-powder/80 rounded-lg text-center bg-cream/20">
            <ImageIcon className="w-8 h-8 mx-auto text-ink/30 stroke-1 mb-2" />
            <p className="text-sm font-medium text-ink/60">
              Aucune image ajoutée pour le moment
            </p>
            <p className="text-xs text-ink/40 mt-0.5">
              Ajoutez une image via Cloudinary ou par URL ci-dessus.
            </p>
          </div>
        )}
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-lg border border-powder text-ink/70 hover:bg-powder/20 text-sm font-medium transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy/90 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isEditing ? "Mettre à jour" : "Enregistrer le produit"}
        </button>
      </div>
    </form>
  );
}