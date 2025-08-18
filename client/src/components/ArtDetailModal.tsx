import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import ArtEditForm from "./ArtEditForm";
import { resolveImageSrc } from "../utils/images";

type Artwork = {
  id: number;
  title: string;
  image: string | null;
  category_id: number | null;
  description: string | null;
};

export default function ArtDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [art, setArt] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArt = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await http.get<Artwork>(`/artworks/${id}`);
      setArt(data);
    } catch (e: any) {
      const msg = e?.response?.status === 404 ? "Artwork not found" : "Failed to load artwork";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchArt(); }, [fetchArt]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this artwork?")) return;
    try {
      await http.delete(`/artworks/${id}`);
      navigate("/gallery");
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to delete artwork");
    }
  };

  if (loading) return <div className="p-4 text-white/80">Loading…</div>;

  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 rounded-full bg-white/15 px-4 py-2 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          ← Back
        </button>
        <div className="rounded-2xl border border-rose-300/40 bg-rose-500/15 text-rose-200 px-3 py-2">
          {error}
        </div>
      </div>
    );
  }

  if (!art) return null;

  const imgSrc = resolveImageSrc(art.image);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-full bg-white/15 px-4 py-2 text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        ← Back
      </button>

      {!editing ? (
        <div className="overflow-hidden rounded-2xl bg-black/25 text-white ring-1 ring-white/10 backdrop-blur-xl shadow-2xl">
          {imgSrc ? (
            <img src={imgSrc} alt={art.title ?? ""} className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-white/5 flex items-center justify-center text-white/60">No image</div>
          )}

          <div className="p-6">
            <h1 className="text-2xl font-semibold">{art.title}</h1>
            {art.description && <p className="mt-2 text-white/80">{art.description}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center rounded-md bg-white/15 px-3 py-1.5 text-sm hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center rounded-md bg-[#8b0000] px-3 py-1.5 text-sm hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <ArtEditForm
          artwork={art}
          onCancel={() => setEditing(false)}
          onUpdate={async () => {
            await fetchArt();
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
