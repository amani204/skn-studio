"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, Upload } from "lucide-react";

export type ProductImageData = {
  url: string;
  alt?: string;
};

type ImageUploaderProps = {
  images: ProductImageData[];
  onChange: (images: ProductImageData[]) => void;
};

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        body: formData,
      });

      // ✅ Check if response is OK before parsing JSON
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erreur lors de l'upload");
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onChange([...images, { url: data.url }]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink/40">Images</label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, index) => (
          <div key={index} className="group relative aspect-square overflow-hidden rounded-lg border border-powder/40">
            <Image
              src={img.url}
              alt={img.alt || `Image ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1.5 top-1.5 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-powder/40 transition-colors hover:border-navy/40 disabled:opacity-50"
        >
          {isUploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-navy/20 border-t-navy" />
          ) : (
            <>
              <Upload size={24} className="text-ink/30" strokeWidth={1.5} />
              <span className="mt-1 text-xs text-ink/40">Ajouter</span>
            </>
          )}
        </button>
      </div>

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}