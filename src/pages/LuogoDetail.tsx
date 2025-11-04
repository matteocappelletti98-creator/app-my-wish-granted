import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { getPOIArticleByPoiId, POIArticle } from "@/lib/articles";
import { ArrowLeft, MapPin, Share2, Bookmark, Camera, ExternalLink } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

// Mock data per articoli editoriali dedicati
const getEditorialArticles = (placeName: string) => [
  {
    id: 1,
    title: `La storia nascosta di ${placeName}`,
    excerpt: `Scopri le origini e i segreti meglio custoditi di questo luogo magico che ha fatto innamorare generazioni di visitatori.`,
    author: "Marco Bianchi",
    date: "2 giorni fa",
    readTime: "5 min",
    image: "/public/duomodicomo.png",
    category: "Storia"
  },
  {
    id: 2,
    title: `Guida locale: cosa non perdere a ${placeName}`,
    excerpt: `I consigli esclusivi di chi vive qui per vivere un'esperienza autentica e scoprire i dettagli che solo i locali conoscono.`,
    author: "Elena Rossi",
    date: "1 settimana fa",
    readTime: "8 min",
    image: "/public/beretta.png",
    category: "Guida"
  },
  {
    id: 3,
    title: `Fotografia: i migliori angoli di ${placeName}`,
    excerpt: `Una guida fotografica completa per catturare la bellezza di questo luogo nei momenti migliori della giornata.`,
    author: "Davide Neri",
    date: "2 settimane fa",
    readTime: "6 min",
    image: "/public/caffe-ecaffe-immagine.jpg",
    category: "Fotografia"
  }
];

export default function LuogoDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [poiArticle, setPOIArticle] = useState<POIArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlacesFromSheet(CSV_URL);
        const foundPlace = data.find(p => p.slug === slug);
        setPlace(foundPlace || null);
        
        // Cerca l'articolo POI collegato se il luogo esiste
        if (foundPlace?.id) {
          const article = getPOIArticleByPoiId(foundPlace.id);
          setPOIArticle(article);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 flex items-center justify-center">
        <div className="text-blue-600 font-light tracking-wide">Caricamento...</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-blue-900 mb-4">Luogo non trovato</h1>
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Torna indietro
          </button>
        </div>
      </div>
    );
  }

  const articles = getEditorialArticles(place.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-blue-100/20">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-[50vh] md:min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          {place.image ? (
            <img 
              src={place.image} 
              alt={place.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-blue-400 text-6xl md:text-8xl">📍</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Navigation - Mobile Friendly */}
        <nav className="relative z-10 p-4 md:p-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/30 transition-all text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Indietro</span>
          </button>
        </nav>

        {/* Place Info - Mobile Optimized */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                  <CategoryBadge category={place.category} />
                </div>
                <h1 className="text-2xl md:text-4xl font-light mb-2 md:mb-3 tracking-wide">{place.name}</h1>
                <div className="space-y-1 mb-3">
                  {place.address && (
                    <div className="flex items-center gap-2 text-white/90 text-sm md:text-base">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="font-light">{place.address}</span>
                    </div>
                  )}
                  {(place.city || place.country) && (
                    <div className="flex items-center gap-2 text-white/90 text-sm md:text-base">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                      <span className="font-light">{place.city}{place.city && place.country ? ", " : ""}{place.country}</span>
                    </div>
                  )}
                </div>
                {place.description && (
                  <p className="text-sm md:text-lg font-light text-white/90 max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
                    {place.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2 md:gap-3 flex-wrap">
                {/* Pulsante Google Maps */}
                {(place.address || place.city) && (
                  <button
                    onClick={() => {
                      const query = encodeURIComponent(place.address || `${place.name}, ${place.city}, ${place.country}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                    className="px-3 py-2 md:px-4 md:py-2 bg-green-600/90 backdrop-blur-md rounded-xl hover:bg-green-700/90 transition-all text-white font-medium flex items-center gap-2 text-sm md:text-base"
                  >
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    Google Maps
                  </button>
                )}
                
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all"
                >
                  <Bookmark className={`w-4 h-4 md:w-5 md:h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 md:p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all">
                  <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POI Article Section - Mobile Optimized */}
      {poiArticle && (
        <section className="px-4 md:px-6 py-8 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-blue-100/50 overflow-hidden">
              {/* Article Header */}
              {poiArticle.cover && (
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={poiArticle.cover} 
                    alt={poiArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Article Content */}
              <div className="p-4 md:p-8">
                <div className="mb-4 md:mb-6">
                  <h2 className="text-xl md:text-3xl font-light text-blue-900 mb-3 md:mb-4 tracking-wide">
                    {poiArticle.title}
                  </h2>
                  {poiArticle.updated && (
                    <div className="text-sm text-blue-600/70">
                      Aggiornato il {new Date(poiArticle.updated).toLocaleDateString('it-IT')}
                    </div>
                  )}
                </div>
                
                {/* Article Body */}
                <div 
                  className="prose prose-blue max-w-none text-blue-800/90 font-light leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: poiArticle.html }}
                />
                
                {/* Tags */}
                {poiArticle.tags && poiArticle.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-blue-100">
                    <div className="flex flex-wrap gap-2">
                      {poiArticle.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Mobile Optimized */}
      <section className="px-4 md:px-6 pb-8 md:pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-light mb-3 md:mb-4 tracking-wide">
                Hai visitato {place.name}?
              </h3>
              <p className="text-sm md:text-base text-blue-100 font-light mb-6 md:mb-8 max-w-2xl mx-auto px-2">
                Condividi la tua esperienza e aiuta altri viaggiatori a scoprire questo luogo
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  className="px-6 md:px-8 py-2 md:py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors text-sm md:text-base"
                >
                  Scrivi una recensione
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}