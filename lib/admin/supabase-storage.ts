import "server-only";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — server-only, never exposed to the browser
);

const BUCKET = "product-images";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadProductImage(
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Type de fichier non autorisé (JPEG, PNG, WebP uniquement)" };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { error: "Fichier trop volumineux (5MB maximum)" };
  }

  const ext = file.type.split("/")[1];
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Supabase upload error:", error);
    return { error: "Échec du téléversement" };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { url: data.publicUrl };
}