import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  // Set the destination for upload files
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    // "public/images" is the directory where files will be stored, because we are using the "public" folder as static folder
    cb(null, "public/images");
  },

  // Set the file name for uploaded file
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
// Create the middleware with the storage configuration above
const upload = multer({ storage });

// Export the middleware
export default upload;
