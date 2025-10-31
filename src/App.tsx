import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Home from "@/pages/Home";
import VirtualExploration from "@/pages/VirtualExploration";
import Luoghi from "@/pages/Luoghi";
import Blog from "@/pages/Blog";
import LuogoDetail from "@/pages/LuogoDetail";
import ArticlePage from "@/pages/ArticlePage";
import AddPlace from "@/pages/AddPlace";
import TravellerPath from "@/pages/TravellerPath";
import Impostazioni from "@/pages/Impostazioni";
import Privacy from "@/pages/Privacy";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import UserAuth from "@/pages/UserAuth";

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
        <Route path="/articolo/:slug" element={<ArticlePage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/user-auth" element={<UserAuth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/traveller-path" element={<TravellerPath />} />
        <Route path="/impostazioni" element={<Impostazioni />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
