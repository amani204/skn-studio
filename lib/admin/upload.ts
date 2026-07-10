import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — server-only, bypasses RLS, never expose to client
);

const BUCKET = "product-images";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export type UploadResult = { url: string } | { error: string };

/**
 * Uploads a single image file to Supabase Storage.
 * Validates type and size server-side — never trust the browser's
 * <input accept> attribute alone, that's UI-only, not a real restriction.
 */
export async function uploadProductImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Type de fichier non autorisé. Utilisez JPEG, PNG ou WebP." };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Fichier trop volumineux (max 5MB)." };
  }

  const extension = file.type.split("/")[1];
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    return { error: "Échec du téléchargement de l'image." };
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName);

  return { url: publicUrlData.publicUrl };
}

export async function deleteProductImage(url: string): Promise<void> {
  const fileName = url.split("/").pop();
  if (!fileName) return;

  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([fileName]);
  if (error) {
    console.error("Supabase delete error:", error);
    // Non-fatal — don't block the calling operation over a storage cleanup failure
  }
}