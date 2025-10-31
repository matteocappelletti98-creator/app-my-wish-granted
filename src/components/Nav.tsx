import { Link, useLocation } from "react-router-dom";
import { Home, Map, List, FileText, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Nav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const active = (p: string): boolean => location.pathname === p;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-blue-100/30">
      <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
        <Link
          to="/"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <Home
            className={`w-5 h-5 ${
              active("/") ? "text-white" : "text-blue-400"
            }`}
            strokeWidth={active("/") ? 2 : 1.5}
          />
        </Link>

        <Link
          to="/virtual-exploration"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/virtual-exploration")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <Map
            className={`w-5 h-5 ${
              active("/virtual-exploration") ? "text-white" : "text-blue-400"
            }`}
            strokeWidth={active("/virtual-exploration") ? 2 : 1.5}
          />
        </Link>

        <Link
          to="/luoghi"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/luoghi")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <List
            className={`w-5 h-5 ${
              active("/luoghi") ? "text-white" : "text-blue-400"
            }`}
            strokeWidth={active("/luoghi") ? 2 : 1.5}
          />
        </Link>

        <Link
          to="/blog"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/blog")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <FileText
            className={`w-5 h-5 ${
              active("/blog") ? "text-white" : "text-blue-400"
            }`}
            strokeWidth={active("/blog") ? 2 : 1.5}
          />
        </Link>

        <Link
          to="/traveller-path"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/traveller-path")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <MapPin
            className={`w-5 h-5 ${
              active("/traveller-path") ? "text-white" : "text-blue-400"
            }`}
            strokeWidth={active("/traveller-path") ? 2 : 1.5}
          />
        </Link>
      </div>
    </nav>
  );
}