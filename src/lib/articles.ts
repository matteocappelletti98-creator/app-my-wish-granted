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

// Simple frontmatter parser for browser
function parseFrontmatter(content: string) {
  const lines = content.split('\n');
  if (lines[0] !== '---') {
    return { data: {}, content };
  }
  
  let endIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      endIndex = i;
      break;
    }
  }
  
  if (endIndex === -1) {
    return { data: {}, content };
  }
  
  const frontmatterLines = lines.slice(1, endIndex);
  const markdownContent = lines.slice(endIndex + 1).join('\n');
  
  const data: any = {};
  
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove comments (everything after #)
      const hashIndex = value.indexOf('#');
      if (hashIndex >= 0) {
        value = value.substring(0, hashIndex).trim();
      }
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        const arrayContent = value.slice(1, -1);
        data[key] = arrayContent.split(',').map(item => 
          item.trim().replace(/['"]/g, '')
        ).filter(Boolean);
      } else {
        data[key] = value;
      }
    }
  }
  
  return { data, content: markdownContent };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getAllArticles(language: string = 'it'): ArticleMeta[] {
  console.log("getAllArticles - files found:", Object.keys(files));
  console.log("getAllArticles - requested language:", language);
  
  // Raggruppa articoli per base name (senza estensione lingua)
  const articleGroups: { [baseName: string]: { [lang: string]: { path: string; data: any } } } = {};
  
  Object.entries(files).forEach(([path, raw]) => {
    const fileName = path.split('/').pop()!;
    const match = fileName.match(/^(.+)\.(it|en|fr|de|es)\.md$/);
    
    if (match) {
      const [, baseName, lang] = match;
      if (!articleGroups[baseName]) {
        articleGroups[baseName] = {};
      }
      
      const { data } = parseFrontmatter(raw as string);
      articleGroups[baseName][lang] = { path, data };
    }
  });
  
  console.log("Article groups:", articleGroups);
  
  // Per ogni gruppo, scegli la versione nella lingua richiesta o fallback inglese
  const articles: ArticleMeta[] = [];
  
  Object.entries(articleGroups).forEach(([baseName, langs]) => {
    let selectedLang = language;
    let articleData = langs[language];
    
    // Se non esiste nella lingua richiesta, usa l'inglese come fallback
    if (!articleData && langs['en']) {
      selectedLang = 'en';
      articleData = langs['en'];
      console.log(`Fallback to English for article: ${baseName}`);
    }
    
    // Se non esiste nemmeno in inglese, prendi la prima disponibile
    if (!articleData) {
      const availableLangs = Object.keys(langs);
      if (availableLangs.length > 0) {
        selectedLang = availableLangs[0];
        articleData = langs[selectedLang];
        console.log(`Using ${selectedLang} for article: ${baseName}`);
      }
    }
    
    if (articleData) {
      const { data } = articleData;
      const titolo = (data.titolo ?? "Senza titolo") as string;
      articles.push({
        id: (data.id ?? slugify(titolo)) as string,
        titolo,
        tipo: (data.tipo ?? "tip") as ArticleMeta["tipo"],
        autore: data.autore as string | undefined,
        data: data.data as string | undefined,
        cover: data.cover as string | undefined,
        tags: (data.tags ?? []) as string[],
        slug: slugify(titolo),
      });
    }
  });
  
  return articles.sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""));
}

export function getArticleBySlug(slug: string, language: string = 'it'): Article | null {
  console.log("getArticleBySlug - searching for slug:", slug, "in language:", language);
  console.log("getArticleBySlug - available files:", Object.keys(files));
  
  // Raggruppa articoli per base name e trova corrispondenze per slug
  const articleGroups: { [baseName: string]: { [lang: string]: { path: string; data: any; content: string } } } = {};
  
  Object.entries(files).forEach(([path, raw]) => {
    const fileName = path.split('/').pop()!;
    const match = fileName.match(/^(.+)\.(it|en|fr|de|es)\.md$/);
    
    if (match) {
      const [, baseName, lang] = match;
      if (!articleGroups[baseName]) {
        articleGroups[baseName] = {};
      }
      
      const { data, content } = parseFrontmatter(raw as string);
      articleGroups[baseName][lang] = { path, data, content };
    }
  });
  
  // Cerca l'articolo che corrisponde al slug
  for (const [baseName, langs] of Object.entries(articleGroups)) {
    // Controlla se qualsiasi versione linguistica corrisponde al slug
    const matchingLang = Object.entries(langs).find(([lang, article]) => {
      const titolo = (article.data.titolo ?? "Senza titolo") as string;
      return slugify(titolo) === slug;
    });
    
    if (matchingLang) {
      console.log("Found article group for slug:", slug);
      
      // Cerca nella lingua richiesta
      let selectedArticle = langs[language];
      let usedLang = language;
      
      // Se non esiste nella lingua richiesta, usa l'inglese come fallback
      if (!selectedArticle && langs['en']) {
        selectedArticle = langs['en'];
        usedLang = 'en';
        console.log(`Fallback to English for article: ${baseName}`);
      }
      
      // Se non esiste nemmeno in inglese, prendi la prima disponibile
      if (!selectedArticle) {
        const availableLangs = Object.keys(langs);
        if (availableLangs.length > 0) {
          usedLang = availableLangs[0];
          selectedArticle = langs[usedLang];
          console.log(`Using ${usedLang} for article: ${baseName}`);
        }
      }
      
      if (selectedArticle) {
        const { data, content } = selectedArticle;
        const html = marked(content) as string;
        const titolo = (data.titolo ?? "Senza titolo") as string;
        
        console.log(`Match found! Using ${usedLang} version. Processing content...`);
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
  }
  
  console.log("No matching article found for slug:", slug);
  return null;
}