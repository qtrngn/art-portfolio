// TYPES

export type Category = { id: number; name: string };
export type Artwork = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;       
  category_id: number | null;
};