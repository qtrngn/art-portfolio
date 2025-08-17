import express, { Application }from "express"; 
import cors from "cors"; 
import bodyParser from "body-parser";



import artworkRoutes from "./routes/artworks";
import categoryRoutes from "./routes/categories";

const app: Application = express(); 
const PORT = 3000; 

// USE THE CORS PACKAGE
app.use(cors());

// TELL THE SERVER WHICH FOLDER TO SAVE IMAGES
app.use(express.static("public"));
app.use(bodyParser.json())

// ROUTES

app.use('/artworks', artworkRoutes);
app.use('/categories',categoryRoutes ); 

app.listen(PORT, () => {
    console.log(`Access this app at http://localhost:${PORT}/`);
})