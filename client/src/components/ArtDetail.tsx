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

  if (loading) return <div className="p-4 text-gray-500">Loading…</div>;
  if (error) {
    return (
      <div className="p-4">
        <button onClick={() => navigate(-1)} className="mb-4 rounded-md bg-gray-200 px-3 py-1.5">
          ← Back
        </button>
        <div className="rounded-md border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2">{error}</div>
      </div>
    );
  }
  if (!art) return null;

  const imgSrc = resolveImageSrc(art.image);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 rounded-md bg-gray-200 px-3 py-1.5 text-gray-800 hover:bg-gray-300"
      >
        ← Back
      </button>

      {!editing ? (
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          {imgSrc ? (
            <img src={imgSrc} alt={art.title} className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">{art.title}</h1>
            {art.description && <p className="mt-2 text-gray-700">{art.description}</p>}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center rounded-lg bg-rose-600 px-4 py-2.5 text-white font-medium hover:bg-rose-700"
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
