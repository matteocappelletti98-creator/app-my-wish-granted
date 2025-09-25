export type ArticleMeta = {
  id: string;
  titolo: string;
  tipo: "faq" | "tip" | "daytrip";
  autore?: string;
  data?: string;
  cover?: string;
  tags?: string[];
  slug: string;
};

export type Article = ArticleMeta & { html: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function getAllArticles(): ArticleMeta[] {
  // Placeholder data until markdown files are available
  return [
    {
      id: "welcome",
      titolo: "Benvenuto nella Guida",
      tipo: "tip",
      autore: "Guide Team", 
      data: "2024-01-01",
      cover: "/conceptlab.jpg",
      tags: ["benvenuto"],
      slug: "welcome"
    }
  ];
}

export function getArticleBySlug(slug: string): Article | null {
  const articles = getAllArticles();
  const meta = articles.find(a => a.slug === slug);
  if (!meta) return null;
  
  return {
    ...meta,
    html: "<h1>Articolo in arrivo</h1><p>I contenuti markdown saranno disponibili a breve.</p>"
  };
}
