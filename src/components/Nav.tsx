import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Nav() {
  const location = useLocation();
  const { t } = useLanguage();
  
  const active = (p: string): boolean => location.pathname === p;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-blue-50/60 to-transparent backdrop-blur-md">
      <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
        <Link
          to="/"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <span className="text-2xl">🏡</span>
        </Link>

        <Link
          to="/virtual-exploration"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/virtual-exploration")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <span className="text-2xl">🌎</span>
        </Link>

        <Link
          to="/profile"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/profile")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <span className="text-2xl">💙</span>
        </Link>

        <Link
          to="/blog"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/blog")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <span className="text-2xl">✏️</span>
        </Link>

        <Link
          to="/traveller-path"
          className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all active:scale-90 ${
            active("/traveller-path")
              ? "bg-blue-600"
              : ""
          }`}
        >
          <span className="text-2xl">🧞</span>
        </Link>
      </div>
    </nav>
  );
}