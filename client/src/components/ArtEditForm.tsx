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
  const [categoryId, setCategoryId] = useState<number | "">(
    artwork.category_id ?? ""
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview for newly selected image
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Load categories (protected endpoint)
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
        // If replacing the image, use multipart/form-data
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        if (categoryId !== "") fd.append("category_id", String(categoryId));
        fd.append("image", file); // field name must match upload.single("image")

        await http.put(`/artworks/${artwork.id}`, fd); // let the browser set the boundary
      } else {
        // Text-only update → JSON is fine
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
      className="space-y-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4"
    >
      <h2 className="text-lg font-semibold text-gray-900">Edit Artwork</h2>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 text-rose-700 px-3 py-2">
          {error}
        </div>
      )}

      {/* Current image (if any) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Image</label>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            {currentImageSrc ? (
              <img src={currentImageSrc} alt={artwork.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
        </div>

        {/* New image preview (if chosen) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Image Preview</label>
          <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-400">No new image selected</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Replace Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 hover:file:bg-gray-200"
        />
        {artwork.image && (
          <p className="mt-1 text-xs text-gray-500 break-all">Current filename/value: {String(artwork.image)}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-black mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className=" text-black mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
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
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2.5 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArtEditForm;
