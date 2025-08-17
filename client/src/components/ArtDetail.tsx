import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArtEditForm from "./ArtEditForm";
import axios from "axios";

// DEFINE TYPE
interface Artwork {
  id: number;
  title: string;
  image: string;
  category_id: number;
  description: string;
}

const ArtDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [art, setArt] = useState<Artwork | null>(null);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

// FETCH ARTWORKS ON MOUNT AND WHEN ID CHANGES
  useEffect(() => {
  const fetchArt = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/artworks/${id}`);
      setArt(res.data);
    } catch (err) {
      console.error("Failed to fetch artwork", err);
    }
  };
    fetchArt();
  }, [id]);

  // DELETE ARTWORK AND NAVIGATE BACK TO HOME
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/artworks/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete artwork", err);
    }
  };

  if (!art) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 text-white px-4 py-2 rounded mb-4"
      >
        ← Back
      </button>
      {!editing ? (
        <>
          <img
            src={`http://localhost:3000/images/${art.image}`}
            alt={art.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{art.title}</h1>
          <p className="mb-4">{art.description}</p>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="text-white px-4 py-2 rounded"
            >
              Delete
            </button>

            <button
              onClick={() => setEditing(true)}
              className="text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        </>
      ) : (
        <ArtEditForm
          artwork={art}
          onCancel={() => setEditing(false)}
          onUpdate={() => {
            fetchArt();
            setEditing(false);
          }}
        />
      )}
    </div>
  );
};

export default ArtDetail;
