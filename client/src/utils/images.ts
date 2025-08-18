const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";


export function resolveImageSrc(image: string | null | undefined): string | null {
  if (!image) return null;
  if (/^https?:\/\//i.test(image)) return image;     
  if (image.startsWith("data:image/")) return image; 
  return `${API_BASE}/images/${image}`;              
}
