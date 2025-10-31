import { Link } from "react-router-dom";
import { Map, List, FileText, Footprints, Clock, Settings, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import comoSponsor from "@/assets/como-sponsor.png";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [hasIncompleteSurvey, setHasIncompleteSurvey] = useState(false);

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
    { value: "it", label: "Italiano" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 px-4 py-4">
        <div className="mx-auto max-w-md">
          {/* Top Bar: Auth Buttons and Settings */}
          <div className="flex justify-between items-center gap-2 mb-8">
            <Link to="/impostazioni">
              <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors active:scale-95">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
            <div className="flex gap-2">
              <Link to="/auth">
                <button className="px-4 py-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors active:scale-95">
                  Accedi
                </button>
              </Link>
              <Link to="/auth">
                <button className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all active:scale-95">
                  Registrati
                </button>
              </Link>
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-6">
            <h1 className="text-6xl font-bebas font-normal text-blue-900 mb-3 tracking-wider">
              TRUE LOCAL
            </h1>
            <p className="text-base text-blue-700/70 font-light tracking-wide mb-4">discover the city</p>
            
            {/* Language Selector Dropdown */}
            <div className="flex justify-center">
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className="w-48 bg-white/70 backdrop-blur-sm border-blue-100/50 rounded-xl">
                  <SelectValue placeholder="Seleziona lingua" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-sm border-blue-100/50 rounded-xl">
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value} className="cursor-pointer">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sponsor Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 text-center mb-6">
            <p className="text-xs text-blue-600/70 font-light mb-4">Official Sponsor</p>
            <img 
              src={comoSponsor} 
              alt="Calcio Como 1907" 
              className="w-40 h-auto mx-auto"
            />
          </div>

          {/* Manifesto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-blue-100/50 text-center">
            <h2 className="text-3xl md:text-4xl font-bebas font-normal text-blue-900 leading-tight tracking-wide">
              WE'VE MAPPED THE BEST OF COMO — EXPLORE IT, CREATE YOUR OWN GUIDE, READ OUR TIPS AND THE TRAVELER QUIZ
            </h2>
            <div className="mt-6 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
          </div>
        </div>
      </header>
    </div>
  );
}