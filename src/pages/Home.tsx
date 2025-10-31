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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 px-4 py-6">
        <div className="mx-auto max-w-md">
          {/* Language Selector - Top Right */}
          <div className="flex justify-end mb-6">
            <div className="flex gap-1 bg-white/70 backdrop-blur-sm rounded-xl p-1 border border-blue-100/50">
              {languages.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value as any)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                    language === lang.value 
                      ? 'bg-blue-600 scale-105' 
                      : 'bg-transparent hover:bg-blue-50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extralight text-blue-900 mb-3 tracking-wider">
              true local
            </h1>
            <p className="text-base text-blue-700/70 font-light tracking-wide">discover the city</p>
          </div>

          {/* Sponsor Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 text-center">
            <p className="text-xs text-blue-600/70 font-light mb-4">Official Sponsor</p>
            <img 
              src={comoSponsor} 
              alt="Calcio Como 1907" 
              className="w-40 h-auto mx-auto"
            />
          </div>
        </div>
      </header>
    </div>
  );
}