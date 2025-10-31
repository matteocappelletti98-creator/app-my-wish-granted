import { Link, useLocation } from "react-router-dom";
import { Home, Map, List, FileText, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Nav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const active = (p: string): boolean => location.pathname === p;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-blue-100/50 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-90 ${
            active("/")
              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
              : "hover:bg-blue-50/50"
          }`}
        >
          <Home
            className={`w-6 h-6 ${
              active("/") ? "text-blue-600" : "text-blue-400"
            }`}
            strokeWidth={active("/") ? 2.5 : 2}
          />
        </Link>

        <Link
          to="/virtual-exploration"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-90 ${
            active("/virtual-exploration")
              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
              : "hover:bg-blue-50/50"
          }`}
        >
          <Map
            className={`w-6 h-6 ${
              active("/virtual-exploration") ? "text-blue-600" : "text-blue-400"
            }`}
            strokeWidth={active("/virtual-exploration") ? 2.5 : 2}
          />
        </Link>

        <Link
          to="/luoghi"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-90 ${
            active("/luoghi")
              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
              : "hover:bg-blue-50/50"
          }`}
        >
          <List
            className={`w-6 h-6 ${
              active("/luoghi") ? "text-blue-600" : "text-blue-400"
            }`}
            strokeWidth={active("/luoghi") ? 2.5 : 2}
          />
        </Link>

        <Link
          to="/blog"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-90 ${
            active("/blog")
              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
              : "hover:bg-blue-50/50"
          }`}
        >
          <FileText
            className={`w-6 h-6 ${
              active("/blog") ? "text-blue-600" : "text-blue-400"
            }`}
            strokeWidth={active("/blog") ? 2.5 : 2}
          />
        </Link>

        <Link
          to="/traveller-path"
          className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all active:scale-90 ${
            active("/traveller-path")
              ? "bg-gradient-to-br from-blue-100 to-indigo-100"
              : "hover:bg-blue-50/50"
          }`}
        >
          <MapPin
            className={`w-6 h-6 ${
              active("/traveller-path") ? "text-blue-600" : "text-blue-400"
            }`}
            strokeWidth={active("/traveller-path") ? 2.5 : 2}
          />
        </Link>
      </div>
    </nav>
  );
}