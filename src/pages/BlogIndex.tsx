import { getAllArticles } from "../lib/articles";
import { Link } from "react-router-dom";

export default function BlogIndex() {
  const items = getAllArticles();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Blog</h1>
      <div className="grid gap-4">
        {items.map(a => (
          <Link key={a.id} to={`/blog/${a.slug}`} className="rounded-xl border p-4 hover:bg-muted/40">
            {a.cover && <img src={a.cover} alt={a.titolo} className="w-full h-48 object-cover rounded-md mb-3" />}
            <h2 className="text-lg font-medium">{a.titolo}</h2>
            <p className="text-sm text-muted-foreground">{a.tipo}{a.data ? ` • ${a.data}` : ""}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
