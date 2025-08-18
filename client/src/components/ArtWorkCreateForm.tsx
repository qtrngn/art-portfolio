import { useState } from "react";
import http from "../api/http";
import CategorySelect from "./CategorySelected";

type Props = { onCreated: () => void };

export default function ArtworkCreateForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Title is required.");

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("description", description.trim());
    if (categoryId) fd.append("category_id", String(categoryId));
    if (file) fd.append("image", file);

    setSubmitting(true);
    try {
      await http.post("/artworks", fd, { headers: { "Content-Type": "multipart/form-data" }});
      setTitle(""); setDescription(""); setCategoryId(null); setFile(null);
      onCreated();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to create artwork");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900">Add new artwork</h2>

      {error && <div className="rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-3 py-2">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          className="text-black mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          value={title} onChange={e=>setTitle(e.target.value)} required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-black"
          rows={3} value={description} onChange={e=>setDescription(e.target.value)}
        />
      </div>

      <CategorySelect value={categoryId} onChange={setCategoryId} includeAll={false} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Image (optional)</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-gray-700 hover:file:bg-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
