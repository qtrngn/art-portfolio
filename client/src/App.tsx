import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import SignUp from "./pages/SignUp";
import ArtDetail from "./components/ArtDetail";
import ProtectedRoute from "./utils/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/art/:id"
          element={
            <ProtectedRoute>
              <ArtDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
