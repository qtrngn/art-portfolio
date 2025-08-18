import { useEffect, useState } from "react";
import http from "../api/http";
import type { Category } from "../types";

type Props = {
  value: number | null;
  onChange: (id: number | null) => void;
  includeAll?: boolean;
};

export default function CategorySelected({ value, onChange, includeAll = true }: Props) {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const { data } = await http.get<Category[]>("/categories");
        if (ok) setCats(data || []);
      } catch {
        if (ok) setCats([]);
      } finally {
        if (ok) setLoading(false);
      }
    })();
    return () => { ok = false; };
  }, []);

  if (loading) {
    return (
      <ul className="space-y-2">
        <li className="h-9 w-full rounded-lg bg-white/10 animate-pulse" />
        <li className="h-9 w-full rounded-lg bg-white/10 animate-pulse" />
        <li className="h-9 w-full rounded-lg bg-white/10 animate-pulse" />
      </ul>
    );
  }

  const Item = ({ id, label }: { id: number | null; label: string }) => {
    const active = value === id || (id === null && value === null);
    return (
      <button
        type="button"
        onClick={() => onChange(id)}
        className={`w-full text-left rounded-lg px-3 py-2 transition
          ${active ? "bg-white/20 ring-1 ring-white/20" : "hover:bg-white/10"}
          text-white`}
      >
        {label}
      </button>
    );
  };

  return (
    <ul className="space-y-2">
      {includeAll && <li><Item id={null} label="No category" /></li>}
      {cats.map((c) => (
        <li key={c.id}><Item id={c.id} label={c.name} /></li>
      ))}
    </ul>
  );
}
