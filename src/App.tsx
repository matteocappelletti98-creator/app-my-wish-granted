// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PlacesPage from "@/pages/PlacesPage";
import AddPlace from "@/pages/AddPlace";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}