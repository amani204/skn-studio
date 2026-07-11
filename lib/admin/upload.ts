import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

export async function uploadProductImage(file: File) {
  try {
    const extension = file.name.split(".").pop();
    const filename = `products/${randomUUID()}.${extension}`;

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return { url: blob.url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Erreur lors de l'upload de l'image" };
  }
}