import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request } from "express";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
fs.mkdirSync(IMAGES_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (_req, file, cb) => {
    const safeBase = path
      .basename(file.originalname)         
      .replace(/\s+/g, "_")                 
      .replace(/[^a-zA-Z0-9._-]/g, "");     
    const ext = path.extname(safeBase) || ""; 
    const id = crypto.randomUUID();
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const allowed = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
]);

const fileFilter: multer.Options["fileFilter"] = (_req: Request, file, cb) => {
  if (allowed.has(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

export default upload;
