import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Index from "@/pages/Index";
import PlacesPage from "@/pages/PlacesPage";
import AddPlace from "@/pages/AddPlace";
import MyExplore from "@/pages/MyExplore";
import PoiPage from "@/pages/PoiPage";
import Blog from "@/pages/Blog";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="/my-explore" element={<MyExplore />} />
        <Route path="/poi/:slug" element={<PoiPage />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}
