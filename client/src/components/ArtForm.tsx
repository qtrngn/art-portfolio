import { useState, useEffect } from "react";
import axios from "axios";


// DEFINE TYPE
interface Category {
  id: number;
  name: string;
}

const ArtForm = () => {
  // FORM STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // FETCH CATEGORIES
  useEffect(() => {
    axios.get("http://localhost:3000/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // HANDLE FORM SUBMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (categoryId !== null) formData.append("category_id", categoryId.toString());
    if (image) formData.append("image", image);

    try {
      await axios.post("http://localhost:3000/artworks", formData);
      alert("Artwork created!");
      // CLEAR FORM
      setTitle("");
      setDescription("");
      setCategoryId(null);
      setImage(null);
    } catch (err) {
      console.error("Error submitting artwork:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select
        className="border p-2 w-full mb-2"
        value={categoryId ?? ""}
        onChange={(e) => setCategoryId(Number(e.target.value))}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />
      <button type="submit" className=" text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default ArtForm;
