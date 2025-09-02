import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Index from "@/pages/Index";
import MyExplore from "@/pages/MyExplore";
import Blog from "@/pages/Blog";
import PoiPage from "@/pages/PoiPage";
import PlacesPage from "@/pages/PlacesPage";
import AddPlace from "@/pages/AddPlace";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}