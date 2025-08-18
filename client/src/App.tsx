// App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import SignUp from "./pages/SignUp";
import ArtDetail from "./components/ArtDetailModal";
import ProtectedRoute from "./utils/ProtectedRoute";

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Navigate to="/gallery" replace />} />
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
        <Route path="*" element={<Navigate to="/gallery" replace />} />
      </Routes>
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/art/:id"
            element={
              <ProtectedRoute>
                <ArtDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
