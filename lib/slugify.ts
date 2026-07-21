/**
 * Converts a string into a URL-safe slug.
 * Handles French/Arabic-transliterated accented characters gracefully.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-|-$/g, ""); // trim leading/trailing dashes
}