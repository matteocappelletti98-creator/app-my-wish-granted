import { Link, useLocation } from "react-router-dom";
import { Home, Map, List, FileText, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Nav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const active = (p: string) =>
    pathname === p;

  return (
    <nav className="w-full bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 border-b border-blue-100/50">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-6 justify-center items-center">
          <Link to="/" className={`group transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110 ${
              active("/") 
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-blue-200' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100'
            }`}>
              <Home className={`w-8 h-8 ${active("/") ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={1.5} />
            </div>
          </Link>
          
          <Link to="/virtual-exploration" className={`group transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110 ${
              active("/virtual-exploration") 
                ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-blue-200' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100'
            }`}>
              <Map className={`w-8 h-8 ${active("/virtual-exploration") ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={1.5} />
            </div>
          </Link>
          
          <Link to="/luoghi" className={`group transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110 ${
              active("/luoghi") 
                ? 'bg-gradient-to-br from-indigo-100 to-blue-100 shadow-blue-200' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-blue-100'
            }`}>
              <List className={`w-8 h-8 ${active("/luoghi") ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={1.5} />
            </div>
          </Link>
          
          <Link to="/blog" className={`group transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110 ${
              active("/blog") 
                ? 'bg-gradient-to-br from-purple-100 to-indigo-100 shadow-blue-200' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100'
            }`}>
              <FileText className={`w-8 h-8 ${active("/blog") ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={1.5} />
            </div>
          </Link>
          
          <Link to="/add-place" className={`group transition-all duration-300 hover:-translate-y-1`}>
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110 ${
              active("/add-place") 
                ? 'bg-gradient-to-br from-emerald-100 to-blue-100 shadow-blue-200' 
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-emerald-100 hover:to-blue-100'
            }`}>
              <MapPin className={`w-8 h-8 ${active("/add-place") ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={1.5} />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}