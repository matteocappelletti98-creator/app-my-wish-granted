import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  const active = (p: string) =>
    pathname === p ? "font-semibold underline" : "text-gray-600";

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
        <Link to="/" className={active("/")}>Home</Link>
        <Link to="/virtual-exploration" className={active("/virtual-exploration")}>Virtual Exploration</Link>
        <Link to="/luoghi" className={active("/luoghi")}>Luoghi</Link>
        <Link to="/blog" className={active("/blog")}>Blog</Link>
        <Link to="/add-place" className={active("/add-place")}>Inserisci luogo</Link>
      </div>
    </nav>
  );
}