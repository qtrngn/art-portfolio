import { useEffect, useState } from "react";
import http from "../api/http";
import type { Category } from "../types";

type Props = {
  value: number | null;
  onChange: (id: number | null) => void;
  includeAll?: boolean;
};

export default function CategorySelect({ value, onChange, includeAll = true }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const { data } = await http.get<Category[]>("/categories");
        if (ok) setCats(data);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={loading}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
      >
        {includeAll && <option value="">All</option>}
        {cats.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
