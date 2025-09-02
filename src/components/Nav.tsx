import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const { pathname } = useLocation();
  const active = (p: string) =>
    pathname === p ? "font-semibold underline" : "text-gray-600";

  return (
    <nav className="w-full border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex gap-4">
  <Link to="/" className={active("/")}>Home</Link>
  <Link to="/places" className={active("/places")}>Luoghi</Link>
  <Link to="/add-place" className={active("/add-place")}>Inserisci luogo</Link>
  <Link to="/my-explore" className={active("/my-explore")}>my.explore</Link>
  <Link to="/blog" className={active("/blog")}>Blog</Link>
</div>
    </nav>
  );
}
