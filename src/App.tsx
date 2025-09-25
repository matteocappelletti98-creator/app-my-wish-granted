import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Index from "@/pages/Index";
import PlacesPage from "@/pages/PlacesPage";
import AddPlace from "@/pages/AddPlace";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/places" element={<PlacesPage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}
