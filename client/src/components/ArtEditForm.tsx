import React, { useState, useEffect } from "react";
import axios from "axios";

// DEFINE THE TYPE
interface Artwork {
  id: number;
  title: string;
  description: string;
  category_id: number;
  image: string;
}

interface Category {
  id: number;
  name: string;
}

// PROPS EXPECTED 
interface ArtEditFormProps {
  artwork: Artwork;
  onCancel: () => void;
  onUpdate: () => void;
}

// FUNCTIONAL DEFINITION
const ArtEditForm: React.FC<ArtEditFormProps> = ({
  artwork,
  onCancel,
  onUpdate,
}) => {
// STATES INITIALIZED WITH THE ARTWORK VALUES
  const [title, setTitle] = useState(artwork.title);
  const [description, setDescription] = useState(artwork.description);
  const [categoryId, setCategoryId] = useState(artwork.category_id);
  const [categories, setCategories] = useState<Category[]>([]);

//   LOAD CATEGORIES
  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

//   HANDLE FORM SUBMISSION AND UPDATE ARTWORKS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/artworks/${artwork.id}`, {
        title,
        description,
        category_id: categoryId,
      });
      onUpdate();
    } catch (err) {
      console.error("Failed to update artwork", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">Edit Artwork</h2>

      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          className="border w-full p-2 rounded"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ArtEditForm;
