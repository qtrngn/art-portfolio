import { Router, Request, Response } from "express";
import db from "../db";
import upload from "../storage";
import { RowDataPacket, ResultSetHeader, QueryError } from "mysql2";

const router = Router();

// GET ALL ARTWORKS OR FILTER BY CATEGORY
router.get("/", (req: Request, res: Response) => {
  const { category_id } = req.query;

  let sql = "SELECT * FROM artworks";
  const values: any[] = [];

  if (category_id) {
    sql += " WHERE category_id = ?";
    values.push(category_id);
  }
  
  db.query(sql, values, (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
});

// GET ONE ARTWORK
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM artworks WHERE id = ?",
    [id],
    (err: QueryError | null, results: RowDataPacket[]) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Not found" });
      res.json(results[0]);
    }
  );
});

// POST NEW ARTWORK WITH "FILE UPLOAD"
router.post("/", upload.single("image"), (req: Request, res: Response) => {
  const { title, description, category_id } = req.body;
  const image = req.file?.filename || null;

  const sql =
    "INSERT INTO artworks (title, description, image, category_id) VALUES (?, ?,?,?)";
  const values = [title, description, image, category_id];

  db.query(sql, values, (err: QueryError | null, result: ResultSetHeader) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ id: result.insertId, title, description, image, category_id });
  });
});

// PUT OR (UPDATE) AN ARTWORK
router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, category_id } = req.body;

  const sql =
    "UPDATE artworks SET title = ?, description = ?, category_id = ? WHERE id = ?";
  db.query(
    sql,
    [title, description, category_id, id],
    (err: QueryError | null, result: ResultSetHeader) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Artwork updated", id });
    }
  );
});


// DELETE AN ARTWORK
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    db.query("DELETE FROM artworks WHERE id = ?", [id],  (err: QueryError | null, result: ResultSetHeader) => {
        if(err) return res.status(500).json({ error: err.message})
            res.json({ message: "Artwork deleted", id});
    });
});


export default router;
