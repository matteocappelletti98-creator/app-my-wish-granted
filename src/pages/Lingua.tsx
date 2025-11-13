import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";

export default function Lingua() {
  const { language, setLanguage } = useLanguage();

  const languages: { value: Language; label: string; nativeName: string }[] = [
    { value: "it", label: "Italian", nativeName: "Italiano" },
    { value: "en", label: "English", nativeName: "English" },
    { value: "es", label: "Spanish", nativeName: "Español" },
    { value: "fr", label: "French", nativeName: "Français" },
    { value: "de", label: "German", nativeName: "Deutsch" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/impostazioni" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Indietro</span>
            </Link>
            <h1 className="text-4xl font-extralight text-blue-900 mb-2 tracking-wide">
              Lingua
            </h1>
            <p className="text-blue-700/70 font-light text-sm">
              Scegli la tua lingua preferita
            </p>
          </div>

          {/* Language List */}
          <div className="space-y-3">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className="w-full bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:bg-white/90 shadow-lg transition-all active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h3 className="text-lg font-medium text-blue-900">{lang.nativeName}</h3>
                    <p className="text-blue-600/70 text-sm">{lang.label}</p>
                  </div>
                  {language === lang.value && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
