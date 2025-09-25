import matter from "gray-matter";

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

// Per ora usiamo dati mock, ma il sistema è pronto per i file markdown
const mockArticles: ArticleMeta[] = [
  {
    id: "tp-come-funziona",
    titolo: "Come funziona il Travelling Path",
    tipo: "faq",
    autore: "Team Explore",
    data: "2025-09-25",
    cover: "/articles/conceptlab.jpg",
    tags: ["screening", "personalizzazione"],
    slug: "come-funziona-travelling-path"
  }
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function getAllArticles(): ArticleMeta[] {
  return mockArticles.sort((a, b) => (b.data ?? "").localeCompare(a.data ?? ""));
}

export function getArticleBySlug(slug: string): Article | null {
  const article = mockArticles.find(a => a.slug === slug);
  if (!article) return null;
  
  // HTML content per ora
  const htmlContent = `
<h1>${article.titolo}</h1>

<p>Il Travelling Path è il questionario iniziale che ci aiuta a proporti i posti giusti.
Qui spieghi in poche righe come funziona e perché è utile.</p>

<h2>Come funziona</h2>

<ol>
<li>Completi il questionario iniziale</li>
<li>L'algoritmo analizza le tue preferenze</li>
<li>Ti proponiamo luoghi personalizzati</li>
<li>Esplori e scopri posti nuovi</li>
</ol>

<h2>Perché è utile</h2>

<ul>
<li><strong>Personalizzazione</strong>: Ogni suggerimento è basato sui tuoi gusti</li>
<li><strong>Scoperta</strong>: Trova luoghi che non avresti mai considerato</li>
<li><strong>Efficienza</strong>: Risparmia tempo nella pianificazione</li>
<li><strong>Diversità</strong>: Esplora oltre la tua zona comfort</li>
</ul>
  `;
  
  return {
    ...article,
    html: htmlContent
  };
}