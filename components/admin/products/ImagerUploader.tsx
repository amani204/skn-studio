"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

export type ProductImageData = { url: string; alt?: string };

type ImageUploaderProps = {
  images: ProductImageData[];
  onChange: (images: ProductImageData[]) => void;
};

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, slot: number) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadingSlot(slot);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Échec du téléchargement");

      const newImages = [...images];
      newImages[slot] = { url: data.url };
      onChange(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du téléchargement");
    } finally {
      setUploadingSlot(null);
      e.target.value = "";
    }
  }

  function handleRemove(slot: number) {
    const newImages = images.filter((_, i) => i !== slot);
    onChange(newImages);
  }

  const slots = [0, 1]; // slot 0 = primary image, slot 1 = optional hover image

  return (
    <div>
      <p className="mb-1.5 text-xs uppercase tracking-widest text-ink/40">
        Images (la 2ᵉ s&apos;affiche au survol — optionnelle)
      </p>

      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => {
          const image = images[slot];
          const isUploading = uploadingSlot === slot;

          return (
            <div key={slot}>
              <p className="mb-1 text-[11px] text-ink/40">
                {slot === 0 ? "Image principale" : "Image au survol (optionnel)"}
              </p>
              <div className="relative aspect-square overflow-hidden rounded-lg border border-powder/40 bg-powder/10">
                {image ? (
                  <>
                    <Image src={image.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemove(slot)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
                      aria-label="Supprimer l'image"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-ink/40 hover:text-navy">
                    {isUploading ? (
                      <span className="text-xs">Téléchargement...</span>
                    ) : (
                      <>
                        <Upload size={20} strokeWidth={1.5} />
                        <span className="text-xs">Choisir une image</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => handleFileSelect(e, slot)}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}