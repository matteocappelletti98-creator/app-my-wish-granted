import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, Eye, Heart } from "lucide-react";
import { useState } from "react";

// Mock data per l'articolo
const getArticleById = (id: string) => {
  const articles = {
    "1": {
      id: "1",
      title: "La storia nascosta di Caffé e Caffé",
      content: `
        <p class="text-lg leading-relaxed mb-6">Nascosto tra le strette vie del centro storico di Como, Caffé e Caffé rappresenta molto più di una semplice caffetteria. La sua storia affonda le radici nel 1892, quando la famiglia Rossi aprì quello che allora era solo un piccolo torrefazione.</p>

        <h2 class="text-2xl font-light text-blue-900 mb-4 mt-8">Le origini storiche</h2>
        <p class="mb-6">Nel cuore della città lariana, questo luogo ha visto passare generazioni di comacini e viaggiatori. Le mura di pietra testimoniano decenni di conversazioni, accordi commerciali e momenti di pausa che hanno contribuito a scrivere la storia moderna di Como.</p>

        <blockquote class="border-l-4 border-blue-200 pl-6 italic text-blue-800 my-8 bg-blue-50/50 p-4 rounded-r-xl">
          "Qui non si serve solo caffè, si crea comunità. Ogni tazza racconta una storia, ogni cliente porta con sé un pezzo di Como." - Giuseppe Rossi, proprietario storico
        </blockquote>

        <h2 class="text-2xl font-light text-blue-900 mb-4 mt-8">La tradizione che continua</h2>
        <p class="mb-6">Oggi, Caffé e Caffé mantiene viva la tradizione artigianale della torrefazione, utilizzando tecniche tramandate di generazione in generazione. La miscela esclusiva "Como Oro" è diventata simbolo della città, apprezzata da locals e turisti.</p>

        <p class="mb-6">L'atmosfera intima e accogliente del locale, con i suoi tavoli in legno massello e le lampade dal design vintage, trasporta i visitatori in un'epoca dove il tempo scorreva più lentamente e ogni momento aveva il suo valore.</p>

        <h2 class="text-2xl font-light text-blue-900 mb-4 mt-8">Curiosità e aneddoti</h2>
        <ul class="list-disc pl-6 mb-6 space-y-2">
          <li>Il famoso scrittore Alessandro Manzoni era un cliente abituale quando soggiornava a Como</li>
          <li>Durante la seconda guerra mondiale, il locale servì come punto di incontro clandestino per la resistenza</li>
          <li>La ricetta originale della miscela "Como Oro" è custodita in una cassaforte e conosciuta solo da tre persone</li>
        </ul>
      `,
      author: "Marco Bianchi",
      date: "2 giorni fa",
      readTime: "5 min",
      image: "/public/caffe-ecaffe-immagine.jpg",
      category: "Storia",
      views: 1247,
      likes: 89,
      placeName: "Caffé e Caffé"
    }
  };
  
  return articles[id as keyof typeof articles] || null;
};

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  const article = getArticleById(articleId || "");

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-blue-900 mb-4">Articolo non trovato</h1>
          <Link to="/luoghi" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Torna ai luoghi
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20">
      {/* Header */}
      <header className="px-6 py-6 border-b border-blue-100/30 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link 
            to="/luoghi"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Torna ai luoghi</span>
          </Link>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-blue-50 rounded-xl transition-all"
              title="Salva articolo"
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'text-blue-600 fill-current' : 'text-gray-400'}`} />
            </button>
            <button 
              className="p-2 hover:bg-blue-50 rounded-xl transition-all"
              title="Condividi"
            >
              <Share2 className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Article Hero */}
      <section className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
              <span>{article.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-blue-900 mb-6 tracking-wide leading-tight">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-blue-600/70 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{article.views}</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-12 shadow-xl">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-blue-900/90 leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        </div>
      </section>

      {/* Article Actions */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isLiked 
                      ? 'bg-red-50 border-red-200 text-red-600' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{article.likes + likes}</span>
                </button>
                
                <div className="flex items-center gap-2 text-sm text-blue-600/70">
                  <Eye className="w-4 h-4" />
                  <span>{article.views} visualizzazioni</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">
                    {article.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900">{article.author}</div>
                  <div className="text-xs text-blue-600/70">Autore</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="px-6 pb-16 bg-blue-50/30">
        <div className="max-w-6xl mx-auto py-12">
          <h2 className="text-2xl font-light text-blue-900 text-center mb-8">Altri articoli su {article.placeName}</h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Mock related articles */}
            {[
              {
                id: "2",
                title: "Guida locale: cosa non perdere a Caffé e Caffé",
                excerpt: "I consigli esclusivi di chi vive qui per vivere un'esperienza autentica...",
                image: "/public/beretta.png",
                category: "Guida",
                readTime: "8 min"
              },
              {
                id: "3", 
                title: "Fotografia: i migliori angoli di Caffé e Caffé",
                excerpt: "Una guida fotografica completa per catturare la bellezza...",
                image: "/public/duomodicomo.png",
                category: "Fotografia", 
                readTime: "6 min"
              }
            ].map((relatedArticle) => (
              <Link key={relatedArticle.id} to={`/articolo/${relatedArticle.id}`} className="group">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 overflow-hidden hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={relatedArticle.image} 
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {relatedArticle.category}
                      </span>
                      <span className="text-xs text-blue-600/70">{relatedArticle.readTime}</span>
                    </div>
                    <h3 className="text-lg font-medium text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-blue-700/80 font-light line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}