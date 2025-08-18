const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/**
 * Turn whatever is stored in artworks.image into a usable <img src>.
 * - If it's a full http/https URL, return as-is
 * - If it's a data URL, return as-is
 * - Otherwise treat it as a local filename saved by Multer
 */
export function resolveImageSrc(image: string | null | undefined): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;     // full URL
  if (image.startsWith("data:image/")) return image; // data URL
  return `${API_BASE}/images/${image}`;              // filename (served from public/images)
}
