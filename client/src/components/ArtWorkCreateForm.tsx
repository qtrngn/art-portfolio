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
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-white">add new artwork</h2>

      {error && <div className="rounded-md bg-rose-500/15 text-rose-200 border border-rose-300/40 px-3 py-2">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-white/90">title</label>
        <input
          className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          value={title} onChange={e=>setTitle(e.target.value)} required
          placeholder="Your art's name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white/90">description</label>
        <textarea
          className="mt-1 block w-full rounded-xl border-0 bg-white/10 px-3 py-2 text-white placeholder-white/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/40"
          rows={3} value={description} onChange={e=>setDescription(e.target.value)}
          placeholder="Describe your art..."
        />
      </div>

      
      <CategorySelect value={categoryId} onChange={setCategoryId} />

      <div>
        <label className="block text-sm font-medium text-white/90">image</label>
        <input
          type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-white/90 file:mr-4 file:rounded-md file:border-0 file:bg-white/15 file:px-3 file:py-2 file:text-white hover:file:bg-white/25"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-2xl bg-white/15 px-4 py-2.5 text-white font-medium hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
