import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ArtDetail from "../src/components/ArtDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artworks/:id" element={<ArtDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
