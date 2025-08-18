import { Router, Request, Response } from "express";
import pool from "../db";
import type { RowDataPacket } from "mysql2/promise";
import { auth } from "../middleware/auth"; 

// ALL OF THEM REQUIRE A VALID JWT 
const router = Router();


router.use(auth);

router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM categories");
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Server error" });
  }
});

export default router;
