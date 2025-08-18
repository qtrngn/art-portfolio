import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategorySelected from "../components/CategorySelected";
import ArtworkCreateForm from "../components/ArtWorkCreateForm";
import ArtworkList from "../components/ArtworkList";

// IMAGE


export default function Gallery() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="w-screen px-50 py-6 flex items-center justify-between">
          <h2 className="text-md font-semibold text-gray-900">
            <Link
              to="/gallery"
               className="text-gray-900 visited:text-gray-900 hover:opacity-80 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 rounded"
            >
              my gallery
            </Link>
          </h2>
          <nav className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm text-rose-600 hover:text-rose-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: filters + create */}
          <aside className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Filter
              </h2>
              <CategorySelected value={categoryId} onChange={setCategoryId} />
            </div>

            <ArtworkCreateForm onCreated={() => setRefreshKey((k) => k + 1)} />
          </aside>

          {/* Right column: list */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Artworks
              </h2>
              {categoryId && (
                <button
                  onClick={() => setCategoryId(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Clear filter
                </button>
              )}
            </div>

            <ArtworkList categoryId={categoryId} refreshKey={refreshKey} />
          </section>
        </div>
      </main>
    </div>
  );
}
