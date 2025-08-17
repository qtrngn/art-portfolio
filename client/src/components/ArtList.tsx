import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CategoryFilter from "./CategoryFilter";

interface Artwork {
  id: number;
  title: string;
  image: string;
  category_id: number;
}

const ArtList = () => {
  // STORE ALL ARTWORKS
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  // TRACK THE CURRENTLY CATEGORY FOR FILTERING
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // FETCH ALL ARTWORKS WHEN THE COMPONENTS MOUNTS OR WHEN SELECTEDCATEGORY CHANGES
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(
          selectedCategory != null
            ? `http://localhost:3000/artworks?category_id=${selectedCategory}`
            : "http://localhost:3000/artworks"
        );
        setArtworks(response.data);
      } catch (err) {
        console.error("Failed to load artworks data", err);
      }
    };
    fetchArtworks();
  }, [selectedCategory]);

  return (
    <div>
      <CategoryFilter setSelectedCategory={setSelectedCategory} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded shadow p-4">
            <img
              src={`http://localhost:3000/images/${art.image}`}
              alt={art.title}
              className="w=full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold text-lg mb-2">{art.title}</h2>
            <Link
              to={`/artworks/${art.id}`}
              className="text-blue-600 hover:underline"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtList;
