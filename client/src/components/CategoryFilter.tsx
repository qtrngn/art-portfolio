import { useState, useEffect } from "react";
import axios from "axios";

// DEFINE TYPE
interface Category {
  id: number;
  name: string;
}

// PROPS EXPECTED FOR THE COMPONENT
interface Props {
  setSelectedCategory: (id: number | null) => void;
}

const CategoryFilter = ({ setSelectedCategory }: Props) => {
  // STORE THE LIST OF CATEGORIES FROM THE DATABASE
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Filter by category:</label>
      <select
        onChange={(e) =>
          setSelectedCategory(e.target.value ? Number(e.target.value) : null)
        }
        className="border p-2 rounded"
      >
<option value="">All</option>
{categories.map((cat) => (
    <option key = {cat.id} value={cat.id}>
        {cat.name}
    </option>
))}



      </select>
    </div>
  );
};

export default CategoryFilter;