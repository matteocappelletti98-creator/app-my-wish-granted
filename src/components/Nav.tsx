import { Link, useLocation } from "react-router-dom";
import { Home, Map, List, FileText, MapPin } from "lucide-react";

export default function Nav() {
  const { pathname } = useLocation();
  const active = (p: string) =>
    pathname === p ? "font-medium text-blue-600 scale-105" : "text-blue-700/70 hover:text-blue-600";

  return (
    <nav className="w-full bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 border-b border-blue-100/50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-8 justify-center items-center">
          <Link to="/" className={`${active("/")} transition-all duration-300 tracking-wide font-light hover:scale-105 flex items-center gap-2`}>
            <Home className="w-4 h-4" />
            🏠
          </Link>
          <Link to="/virtual-exploration" className={`${active("/virtual-exploration")} transition-all duration-300 tracking-wide font-light hover:scale-105 flex items-center gap-2`}>
            <Map className="w-4 h-4" />
            🗺️
          </Link>
          <Link to="/luoghi" className={`${active("/luoghi")} transition-all duration-300 tracking-wide font-light hover:scale-105 flex items-center gap-2`}>
            <List className="w-4 h-4" />
            📍
          </Link>
          <Link to="/blog" className={`${active("/blog")} transition-all duration-300 tracking-wide font-light hover:scale-105 flex items-center gap-2`}>
            <FileText className="w-4 h-4" />
            📝
          </Link>
          <Link to="/add-place" className={`${active("/add-place")} transition-all duration-300 tracking-wide font-light hover:scale-105 flex items-center gap-2`}>
            <MapPin className="w-4 h-4" />
            ➕
          </Link>
        </div>
      </div>
    </nav>
  );
}