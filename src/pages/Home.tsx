import { Link } from "react-router-dom";
import { Map, List, FileText, Route, MapPin, Globe, Info, Clock, AlertCircle, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import comoSponsor from "@/assets/como-sponsor.png";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [hasIncompleteSurvey, setHasIncompleteSurvey] = useState(false);
  const [showSurveyMessage, setShowSurveyMessage] = useState(false);

  // Check for incomplete survey on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      const totalQuestions = 11;
      const answeredQuestions = Object.keys(answers).length;
      setHasIncompleteSurvey(answeredQuestions > 0 && answeredQuestions < totalQuestions);
    }
  }, []);

  const languages = [
    { value: "it", label: "🇮🇹" },
    { value: "en", label: "🇬🇧" },
    { value: "fr", label: "🇫🇷" },
    { value: "de", label: "🇩🇪" },
    { value: "es", label: "🇪🇸" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-md">
          {/* App Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extralight text-blue-900 mb-3 tracking-wider">
              true local
            </h1>
            <p className="text-base text-blue-700/70 font-light tracking-wide">discover the city</p>
          </div>

          {/* Sponsor Section - Compact */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-blue-600/70 font-light mb-2">Official Sponsor</p>
                <img 
                  src={comoSponsor} 
                  alt="Calcio Como 1907" 
                  className="w-32 h-auto"
                />
              </div>
              
              {/* Language Selector - Compact */}
              <div className="flex gap-1">
                {languages.map(lang => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value as any)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                      language === lang.value 
                        ? 'bg-blue-600 scale-110' 
                        : 'bg-white/80 hover:bg-blue-50'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation - Mobile Optimized */}
      <main className="relative z-10 px-4">
        <div className="mx-auto max-w-md space-y-4">
          
          {/* Virtual exploration */}
          <Link to="/virtual-exploration" className="block group active:scale-95 transition-transform">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg active:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Map className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-blue-900 mb-1">Virtual exploration</h2>
                  <p className="text-blue-600/70 text-sm">Esplora luoghi sulla mappa</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Luoghi */}
          <Link to="/luoghi" className="block group active:scale-95 transition-transform">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg active:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <List className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-blue-900 mb-1">Luoghi</h2>
                  <p className="text-blue-600/70 text-sm">Scopri tutti i luoghi</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Blog */}
          <Link to="/blog" className="block group active:scale-95 transition-transform">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg active:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-blue-900 mb-1">Blog</h2>
                  <p className="text-blue-600/70 text-sm">Articoli e guide</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Traveller Path */}
          <Link to="/traveller-path" className="block group active:scale-95 transition-transform">
            <div className={`backdrop-blur-lg rounded-2xl p-6 border shadow-lg active:shadow-xl transition-all relative ${
              hasIncompleteSurvey 
                ? 'bg-orange-50/80 border-orange-200/50 active:bg-orange-100/90' 
                : 'bg-white/80 border-white/50 active:bg-white/90'
            }`}>
              {hasIncompleteSurvey && (
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  In corso
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  hasIncompleteSurvey 
                    ? 'bg-gradient-to-br from-orange-100 to-yellow-100' 
                    : 'bg-gradient-to-br from-emerald-100 to-blue-100'
                }`}>
                  <Route className={`w-8 h-8 ${hasIncompleteSurvey ? 'text-orange-600' : 'text-blue-600'}`} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl font-medium mb-1 ${hasIncompleteSurvey ? 'text-orange-900' : 'text-blue-900'}`}>
                    Traveller.Path
                  </h2>
                  <p className={`text-sm ${hasIncompleteSurvey ? 'text-orange-600/70' : 'text-blue-600/70'}`}>
                    {hasIncompleteSurvey ? 'Questionario in sospeso' : 'Itinerari personalizzati'}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Bottom Message */}
          <div className="mt-8 pt-8">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/40 text-center">
              <h3 className="text-2xl font-light text-blue-900 mb-2 tracking-wide">
                Which city will next?
              </h3>
              <p className="text-blue-700/70 font-light text-sm">
                Stay tuned my friends
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}