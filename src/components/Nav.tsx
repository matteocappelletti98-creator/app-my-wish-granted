import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  const active = (p: string) =>
    pathname === p ? "font-medium text-ocean-blue scale-105" : "text-foreground/70 hover:text-ocean-blue";

  return (
    <nav className="w-full backdrop-blur-sm bg-background/80 border-b border-border/30">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex gap-8 justify-center items-center">
          <Link to="/" className={`${active("/")} transition-all duration-300 tracking-wide font-light hover:scale-105`}>
            Home
          </Link>
          <Link to="/virtual-exploration" className={`${active("/virtual-exploration")} transition-all duration-300 tracking-wide font-light hover:scale-105`}>
            Virtual Exploration
          </Link>
          <Link to="/luoghi" className={`${active("/luoghi")} transition-all duration-300 tracking-wide font-light hover:scale-105`}>
            Luoghi
          </Link>
          <Link to="/blog" className={`${active("/blog")} transition-all duration-300 tracking-wide font-light hover:scale-105`}>
            Blog
          </Link>
          <Link to="/add-place" className={`${active("/add-place")} transition-all duration-300 tracking-wide font-light hover:scale-105`}>
            Inserisci luogo
          </Link>
        </div>
      </div>
    </nav>
  );
}