import { Router, Request, Response } from "express";
import pool from "../db";
import upload from "../storage";
import { auth } from "../middleware/auth";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const router = Router();

// Helper for Option A (cast Request to read userId set by auth middleware)
const uid = (req: Request) => (req as Request & { userId: number }).userId;

// GET my artworks (optional ?category_id=)
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const userId = uid(req);
    const { category_id } = req.query;

    let sql = "SELECT * FROM artworks WHERE user_id = ?";
    const params: any[] = [userId];

    if (category_id) {
      sql += " AND category_id = ?";
      params.push(Number(category_id));
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// GET one of my artworks by id
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const userId = uid(req);
    const { id } = req.params;

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM artworks WHERE id = ? AND user_id = ?",
      [Number(id), userId]
    );

    if (!rows.length) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// CREATE artwork 
router.post(
  "/",
  auth,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const userId = uid(req);
      const { title, description, category_id } = req.body;
      const image = req.file?.filename ?? null;

      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO artworks (title, description, image, category_id, user_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, image, category_id ? Number(category_id) : null, userId]
      );

      res.status(201).json({
        id: result.insertId,
        title,
        description,
        image,
        category_id: category_id ? Number(category_id) : null,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Server error" });
    }
  }
);

// UPDATE artwork (only if I own it)
router.put("/:id", auth, async (req: Request, res: Response) => {
  try {
    const userId = uid(req);
    const { id } = req.params;
    const { title, description, category_id } = req.body;

    const [result] = await pool.execute<ResultSetHeader>(
      "UPDATE artworks SET title = ?, description = ?, category_id = ? WHERE id = ? AND user_id = ?",
      [title, description, category_id ? Number(category_id) : null, Number(id), userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not found or forbidden" });

    res.json({ message: "Artwork updated", id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// DELETE artwork (only if I own it)
router.delete("/:id", auth, async (req: Request, res: Response) => {
  try {
    const userId = uid(req);
    const { id } = req.params;

    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM artworks WHERE id = ? AND user_id = ?",
      [Number(id), userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not found or forbidden" });

    res.json({ message: "Artwork deleted", id });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
