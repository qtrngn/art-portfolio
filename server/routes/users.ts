import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import pool from "../db";
import { sign } from "../utils/jwt";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
const router = Router();

router.post(
  "/",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const email = String(req.body.email).toLowerCase();
    const pwd = String(req.body.password);
    const [dups] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email=?", [email]);
    if (dups.length) return res.status(409).json({ message: "Email already in use" });

    const hash = await bcrypt.hash(pwd, 10);
    await pool.execute<ResultSetHeader>("INSERT INTO users (email,password) VALUES (?,?)", [email, hash]);
    res.status(201).json({ message: "User created" });
  }
);

router.post(
  "/sign-in",
  body("email").isEmail(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const email = String(req.body.email).toLowerCase();
    const pwd = String(req.body.password);
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id,password FROM users WHERE email=?", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(pwd, user.password as string);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = sign({ userId: user.id as number });
    res.json({ token });
  }
);

export default router;
