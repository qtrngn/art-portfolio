import express from "express";
import cors from "cors";
import "dotenv/config";

import usersRoutes from "./routes/users";
import artworkRoutes from "./routes/artworks";
import categoryRoutes from "./routes/categories";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); 


// ROUTERS
app.use("/users", usersRoutes);        
app.use("/artworks", artworkRoutes);  
app.use("/categories", categoryRoutes); 


app.get("/", (_req, res) => res.json({ ok: true }));

// ERROR
app.use((_req, res) => res.status(404).json({ message: "Not found" }));


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Art Database at http://localhost:${PORT}`);
});
