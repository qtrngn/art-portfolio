import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import pool from "../db";
import { sign } from "../utils/jwt";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
const router = Router();


// CREATE NEW USER, VALIDATE INPUT 
router.post(
  "/",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  async (req, res) => {
    // COLLECT VALIDATION ERROR
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // NORMALIZE EMAIL AND PASSWORD
    const email = String(req.body.email).toLowerCase();
    const pwd = String(req.body.password);

    // CHECK FOR DUPLICATE EMAIL
    const [dups] = await pool.query<RowDataPacket[]>("SELECT id FROM users WHERE email=?", [email]);
    if (dups.length) return res.status(409).json({ message: "Email already in use" });

    // HASH PASSWORD
    const hash = await bcrypt.hash(pwd, 10);
    // INSERT USER RECORD
    await pool.execute<ResultSetHeader>("INSERT INTO users (email,password) VALUES (?,?)", [email, hash]);
    res.status(201).json({ message: "User created" });
  }
);

router.post(
  "/sign-in",
  // VALIDATE EMAIL AND PASSWORD
  body("email").isEmail(),
  body("password").isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const email = String(req.body.email).toLowerCase();
    const pwd = String(req.body.password);

    // LOOK UP USER BY EMAIL
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id,password FROM users WHERE email=?", [email]);
    const user = rows[0];

    // ERROR
    if (!user) return res.status(401).json({ message: "Invalid Account! Please create an account with us." });

    // COMPARE PROVIDED PASSWORD TO STORE HASH
    const ok = await bcrypt.compare(pwd, user.password as string);
    if (!ok) return res.status(401).json({ message: "Invalid information!" });

    const token = sign({ userId: user.id as number });
    res.json({ token });
  }
);

export default router;
