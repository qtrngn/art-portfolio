import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import type { Artwork } from "../types";
import { resolveImageSrc } from "../utils/images";

type Props = {
  categoryId: number | null;
  refreshKey: number;
  onSelect?: (art: Artwork) => void;
};

export default function ArtworkList({ categoryId, refreshKey, onSelect }: Props) {
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 
  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
    if (categoryId !== null) {
  params.category_id = Number(categoryId); 
}
      const { data } = await http.get<Artwork[]>("/artworks", { params });
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load artworks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [categoryId, refreshKey]);

  const remove = async (id: number) => {
    if (!confirm("Delete this artwork?")) return;
    await http.delete(`/artworks/${id}`);
    await load();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-black/20 ring-1 ring-white/10 backdrop-blur-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl px-4 py-3 bg-rose-500/15 text-rose-200 ring-1 ring-rose-300/30">{error}</div>;
  }

  if (!items.length) {
    return <p className="text-white/80">No artworks yet.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((a) => {
        const imgSrc = resolveImageSrc(a.image);
        return (
          <li key={a.id}>
            <div
              role={onSelect ? "button" : undefined}
              onClick={() => onSelect?.(a)}
              className="group overflow-hidden rounded-2xl bg-black/25 text-white ring-1 ring-white/10 backdrop-blur-xl shadow-xl"
            >
              {/* IMAGES */}
              {imgSrc ? (
                <img src={imgSrc} alt={a.title} className="h-40 w-full object-cover group-hover:opacity-90 transition" />
              ) : (
                <div className="h-40 w-full flex items-center justify-center text-white/60 bg-white/5">No image</div>
              )}

              {/* BODY */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold line-clamp-1">{a.title || "Untitled"}</h3>
                {a.description && <p className="text-sm text-white/80 line-clamp-2">{a.description}</p>}

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`/art/${a.id}`}
                    className="inline-flex items-center rounded-md bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(a.id); }}
                    className="inline-flex items-center rounded-md bg-[#8b0000] px-3 py-1.5 text-sm hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
