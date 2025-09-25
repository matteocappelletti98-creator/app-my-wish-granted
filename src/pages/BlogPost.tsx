import { useParams, Navigate } from "react-router-dom";
import { getArticleBySlug } from "../lib/articles";

export default function BlogPost() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug!);
  if (!article) return <Navigate to="/blog" replace />;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {article.cover && <img src={article.cover} alt={article.titolo} className="w-full h-64 object-cover rounded-xl mb-6" />}
      <h1 className="text-2xl font-semibold mb-2">{article.titolo}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        {article.tipo}{article.data ? ` • ${article.data}` : ""}{article.autore ? ` • ${article.autore}` : ""}
      </p>
      <div className="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.html }} />
    </article>
  );
}
