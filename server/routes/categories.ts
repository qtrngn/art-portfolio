import { Router, Request, Response } from "express"; 
import db from "../db";
import { QueryError, RowDataPacket } from "mysql2";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM categories";
    db.query(sql, (err: QueryError | null, results: RowDataPacket) => {
        if (err) return res.status(500).json({error: err.message});
        res.json(results);
    })
})
export default router; 