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
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getAllArticles(): ArticleMeta[] {
  console.log("getAllArticles - files found:", Object.keys(files));
  return Object.entries(files)
    .map(([path, raw]) => {
      console.log("Processing file:", path);
      const { data } = matter(raw as string);
      console.log("Parsed frontmatter:", data);
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
  console.log("getArticleBySlug - searching for slug:", slug);
  console.log("getArticleBySlug - available files:", Object.keys(files));
  
  for (const [path, raw] of Object.entries(files)) {
    console.log("Checking file:", path);
    const file = raw as string;
    const { data, content } = matter(file);
    console.log("File frontmatter:", data);
    console.log("File content:", content);
    const titolo = (data.titolo ?? "Senza titolo") as string;
    const fileSlug = slugify(titolo);
    console.log("Generated slug:", fileSlug, "vs requested:", slug);
    
    if (fileSlug === slug) {
      console.log("Match found! Processing content...");
      const html = marked(content) as string;
      console.log("Generated HTML:", html);
      return {
        id: (data.id ?? slug) as string,
        titolo,
        tipo: (data.tipo ?? "tip") as ArticleMeta["tipo"],
        autore: data.autore as string | undefined,
        data: data.data as string | undefined,
        cover: data.cover as string | undefined,
        tags: (data.tags ?? []) as string[],
        slug,
        html,
      };
    }
  }
  console.log("No matching article found for slug:", slug);
  return null;
}