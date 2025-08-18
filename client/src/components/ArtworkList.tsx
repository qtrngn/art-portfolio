import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import http from "../api/http";
import type { Artwork } from "../types";
import { resolveImageSrc } from "../utils/images";

type Props = {
  categoryId: number | null;
  refreshKey: number;
};

export default function ArtworkList({ categoryId, refreshKey }: Props) {
  const [items, setItems] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = categoryId ? `/artworks?category_id=${categoryId}` : "/artworks";
      const { data } = await http.get<Artwork[]>(url);
      setItems(data);
    } catch (e: any) {
      const msg =
        e?.response?.status === 401
          ? "Please log in again."
          : e?.response?.data?.error || "Failed to load artworks.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, refreshKey]);

  const remove = async (id: number) => {
    if (!confirm("Delete this artwork?")) return;
    await http.delete(`/artworks/${id}`);
    await load();
  };

  if (loading) return <div className="text-gray-500">Loading…</div>;
  if (error)
    return (
      <div className="text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
        {error}
      </div>
    );
  if (items.length === 0) return <div className="text-gray-500">No artworks yet.</div>;

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((a) => {
        const src = resolveImageSrc(a.image);
        return (
          <li
            key={a.id}
            className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden"
          >
            <Link to={`/art/${a.id}`}>
              {src ? (
                <img src={src} alt={a.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </Link>

            <div className="p-4">
              <Link
                to={`/art/${a.id}`}
                className="text-lg font-semibold text-gray-900 hover:underline"
              >
                {a.title}
              </Link>
              {a.description && (
                <p className="text-sm text-gray-600 mt-1">{a.description}</p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => remove(a.id)}
                  className="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-white text-sm hover:bg-rose-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
