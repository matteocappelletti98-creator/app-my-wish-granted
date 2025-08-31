import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PlacesPage from "@/pages/PlacesPage";
import AddPlace from "@/pages/AddPlace";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlacesPage />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}