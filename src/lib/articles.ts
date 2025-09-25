import matter from "gray-matter";
import { marked } from "marked";

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

const files = import.meta.glob("/content/articles/*.md", { as: "raw", eager: true });

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function getAllArticles(): ArticleMeta[] {
  return Object.entries(files)
    .map(([_, raw]) => {
      const { data } = matter(raw as string);
      const titolo = (data.titolo ?? "Senza titolo") as string;
      return {
        id: (data.id ?? slugify(titolo)) as string,
        titolo,
        tipo: (data.tipo ?? "tip") as ArticleMeta["tipo"],
        autore: data.autore as string | undefined,
        data: data.data as string | undefined,
        cover: data.cover as string | undefined,
        tags: (data.tags ?? []) as string[],
        slug: slugify(titolo),
      };
    })
    .sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""));
}

export function getArticleBySlug(slug: string): Article | null {
  for (const raw of Object.values(files)) {
    const file = raw as string;
    const { data, content } = matter(file);
    const titolo = (data.titolo ?? "Senza titolo") as string;
    if (slugify(titolo) === slug) {
      return {
        id: (data.id ?? slug) as string,
        titolo,
        tipo: (data.tipo ?? "tip") as ArticleMeta["tipo"],
        autore: data.autore as string | undefined,
        data: data.data as string | undefined,
        cover: data.cover as string | undefined,
        tags: (data.tags ?? []) as string[],
        slug,
        html: marked.parse(content),
      };
    }
  }
  return null;
}
