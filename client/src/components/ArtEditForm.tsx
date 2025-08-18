import React, { useEffect, useMemo, useState } from "react";
import http from "../api/http";
import { resolveImageSrc } from "../utils/images";

type Artwork = {
  id: number;
  title: string;
  description: string | null;
  category_id: number | null;
  image: string | null;
};

type Category = { id: number; name: string };

type Props = {
  artwork: Artwork;
  onCancel: () => void;
  onUpdate: () => void;
};

const ArtEditForm: React.FC<Props> = ({ artwork, onCancel, onUpdate }) => {
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description ?? "");
  const [categoryId, setCategoryId] = useState<number | "">(artwork.category_id ?? "");
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PREVIEW IMAGE
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // CATEGORIES
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await http.get<Category[]>("/categories");
        if (alive) setCategories(data);
      } catch (e: any) {
        if (alive) setError(e?.response?.data?.error || "Failed to load categories");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");

    setSaving(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        if (categoryId !== "") fd.append("category_id", String(categoryId));
        fd.append("image", file);
        await http.put(`/artworks/${artwork.id}`, fd);
      } else {
        await http.put(`/artworks/${artwork.id}`, {
          title: title.trim(),
          description: description.trim(),
          category_id: categoryId === "" ? null : Number(categoryId),
        });
      }
      onUpdate();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to update artwork");
    } finally {
      setSaving(false);
    }
  };

  const currentImageSrc = resolveImageSrc(artwork.image);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 overflow-hidden rounded-2xl bg-black/25 text-white ring-1 ring-white/10 backdrop-blur-xl shadow-xl p-6"
    >
      <h2 className="text-xl font-semibold">Edit Artwork</h2>

      {error && (
        <div className="rounded-md border border-rose-300/40 bg-rose-500/15 text-rose-200 px-3 py-2">
          {error}
        </div>
      )}

      {/* CURRENT IMAGE + NEW IMAGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">Current Image</label>
          <div className="rounded-xl ring-1 ring-white/10 overflow-hidden bg-white/5">
            {currentImageSrc ? (
              <img src={currentImageSrc} alt={artwork.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-white/60">No image</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">New Image Preview</label>
          <div className="rounded-xl ring-1 ring-white/10 overflow-hidden bg-white/5">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-white/60">No new image selected</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90">Replace Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-white/90 file:mr-4 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:py-2 file:text-white hover:file:bg-white/25"
        />
        {artwork.image && (
          <p className="mt-1 text-xs text-white/70 break-all">Current filename/value: {String(artwork.image)}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="Your art's name..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          placeholder="Say something about your artwork..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
  
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 font-medium text-white hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-2.5 font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArtEditForm;
