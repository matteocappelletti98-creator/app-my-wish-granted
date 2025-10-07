import { Link, useLocation } from "react-router-dom";
import { Home, Map, List, FileText, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Nav() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const active = (p: string) => pathname === p;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/virtual-exploration", icon: Map, label: "Mappa" },
    { path: "/luoghi", icon: List, label: "Luoghi" },
    { path: "/blog", icon: FileText, label: "Blog" },
    { path: "/add-place", icon: MapPin, label: "Aggiungi" },
  ];

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:block w-full bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 border-b border-blue-100/50 sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex gap-4 justify-center items-center">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="group transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 ${
                  active(item.path)
                    ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-blue-200' 
                    : 'bg-gradient-to-br from-white/80 to-blue-50/80 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100'
                }`}>
                  <item.icon className={`w-6 h-6 ${active(item.path) ? 'text-blue-600' : 'text-blue-500 group-hover:text-blue-600'}`} strokeWidth={2} />
                  <span className={`text-xs mt-1 font-medium ${active(item.path) ? 'text-blue-600' : 'text-blue-500'}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Fixed at bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-blue-100 shadow-lg safe-area-inset-bottom">
        <div className="flex justify-around items-center px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center min-w-[60px] py-1 px-2 rounded-xl transition-all duration-300 active:scale-95"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                active(item.path)
                  ? 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md'
                  : 'hover:bg-blue-50/50'
              }`}>
                <item.icon 
                  className={`w-6 h-6 transition-colors ${
                    active(item.path) ? 'text-blue-600' : 'text-blue-400'
                  }`} 
                  strokeWidth={active(item.path) ? 2.5 : 2}
                />
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors ${
                active(item.path) ? 'text-blue-600' : 'text-blue-400'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for mobile to prevent content being hidden behind bottom nav */}
      <div className="md:hidden h-20" />
    </>
  );
}