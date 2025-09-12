import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Home from "@/pages/Home";
import VirtualExploration from "@/pages/VirtualExploration";
import Luoghi from "@/pages/Luoghi";
import Blog from "@/pages/Blog";
import LuogoDetail from "@/pages/LuogoDetail";
import ArticlePage from "@/pages/ArticlePage";
import AddPlace from "@/pages/AddPlace";

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/virtual-exploration" element={<VirtualExploration />} />
        <Route path="/luoghi" element={<Luoghi />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/luogo/:slug" element={<LuogoDetail />} />
        <Route path="/articolo/:articleId" element={<ArticlePage />} />
        <Route path="/add-place" element={<AddPlace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}