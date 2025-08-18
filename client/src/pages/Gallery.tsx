import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArtworkCreateForm from "../components/ArtWorkCreateForm";
import ArtworkList from "../components/ArtworkList";
import CategorySelected from "../components/CategorySelected";
import mainBG from "../images/mainBG.jpeg";
import type { Artwork } from "../types";

export default function Gallery() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) nav("/login", { replace: true });
  }, [nav]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <img src={mainBG} alt="" className="pointer-events-none select-none absolute inset-0 -z-20 w-full h-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/20 to-black/40" />

      {/* Header */}
      <header className="bg-black/20 text-white border-b border-white/10 backdrop-blur-md px-40">
        <div className="w-full px-6 py-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            <Link to="/gallery" className="text-white visited:text-white hover:opacity-80 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded">
              my gallery
            </Link>
          </h2>
          <nav className="flex items-center gap-4">
            <button onClick={handleLogout} className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="relative max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filter list + Create form */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl p-4 text-white bg-black/25 ring-1 ring-white/10 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-semibold mb-3">filter</h3>
              <CategorySelected value={categoryId} onChange={setCategoryId} includeAll />
            </div>

            <div className="rounded-2xl p-4 text-white bg-black/25 ring-1 ring-white/10 backdrop-blur-xl shadow-xl">
              <ArtworkCreateForm onCreated={() => setRefreshKey((k) => k + 1)} />
            </div>
          </aside>

          {/* Artwork list */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">your artworks</h2>
            </div>

            <ArtworkList
              categoryId={categoryId}
              refreshKey={refreshKey}
              onSelect={(art) => setSelected(art)}
            />
          </section>
        </div>
      </main>

     
    </div>
  );
}
