import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar, Share2, Bookmark, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { getArticleBySlug } from "@/lib/articles";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likes, setLikes] = useState(0);

  const article = getArticleBySlug(slug || "", language);
  console.log("ArticlePage - slug:", slug);
  console.log("ArticlePage - article found:", article);
  console.log("ArticlePage - article HTML:", article?.html);

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
              <span className="capitalize">{article.tipo}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-blue-900 mb-6 tracking-wide leading-tight">
              {article.titolo}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-blue-600/70 mb-8">
              {article.autore && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{article.autore}</span>
                </div>
              )}
              {article.data && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{article.data}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 min</span>
              </div>
            </div>
          </div>

          {/* Article Image */}
          {article.cover && (
            <div className="aspect-[16/9] overflow-hidden rounded-3xl mb-12 shadow-xl">
              <img 
                src={article.cover} 
                alt={article.titolo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <div 
              className="text-blue-900/90 leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: article.html }}
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
                  <span className="font-medium">{likes}</span>
                </button>
              </div>
              
              {article.autore && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {article.autore.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-900">{article.autore}</div>
                    <div className="text-xs text-blue-600/70">Autore</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}