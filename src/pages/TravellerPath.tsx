import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Clock, Compass, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import patternBg from "@/assets/pattern-traveler.png";

type TPLanguage = "it" | "en" | "es" | "fr" | "de";

interface Question {
  id: string;
  category: {
    it: string;
    en: string;
    es: string;
    fr: string;
    de: string;
  };
  question: {
    it: string;
    en: string;
    es: string;
    fr: string;
    de: string;
  };
  options: {
    value: string;
    label: {
      it: string;
      en: string;
      es: string;
      fr: string;
      de: string;
    };
    code: number;
  }[];
  multiple?: boolean;
}

const questions: Question[] = [
  {
    id: "profile_type",
    category: { it: "Profilo", en: "Profile", es: "Perfil", fr: "Profil", de: "Profil" },
    question: {
      it: "Sei local o viaggiatore?",
      en: "Are you a local or a traveler?",
      es: "¿Eres local o viajero?",
      fr: "Tu es local ou voyageur ?",
      de: "Bist du ein Local oder ein Reisender?"
    },
    options: [
      { value: "local", label: { it: "local", en: "local", es: "local", fr: "local", de: "local" }, code: 1 },
      { value: "traveler", label: { it: "viaggiatore", en: "traveler", es: "viajero", fr: "voyageur", de: "reisender" }, code: 2 }
    ]
  },
  {
    id: "gender",
    category: { it: "Profilo", en: "Profile", es: "Perfil", fr: "Profil", de: "Profil" },
    question: {
      it: "Genere",
      en: "Gender",
      es: "Genre",
      fr: "Genre",
      de: "Geschlecht"
    },
    options: [
      { value: "male", label: { it: "Uomo", en: "Man", es: "Hombre", fr: "Homme", de: "Mann" }, code: 3 },
      { value: "female", label: { it: "Donna", en: "Woman", es: "Mujer", fr: "Femme", de: "Frau" }, code: 4 },
      { value: "other", label: { it: "Altro", en: "Other", es: "Otro", fr: "Autre", de: "Andere" }, code: 5 }
    ]
  },
  {
    id: "age",
    category: { it: "Profilo", en: "Profile", es: "Perfil", fr: "Profil", de: "Profil" },
    question: {
      it: "Età",
      en: "Age",
      es: "Edad",
      fr: "Âge",
      de: "Alter"
    },
    options: [
      { value: "under_18", label: { it: "Minore di 18", en: "Under 18", es: "Menores de 18", fr: "Moins de 18", de: "Unter 18" }, code: 6 },
      { value: "18_24", label: { it: "18 - 24", en: "18 - 24", es: "18 - 24", fr: "18 - 24", de: "18 - 24" }, code: 7 },
      { value: "25_34", label: { it: "25 - 34", en: "25 - 34", es: "25 - 34", fr: "25 - 34", de: "25 - 34" }, code: 8 },
      { value: "35_49", label: { it: "35 - 49", en: "35 - 49", es: "35 - 49", fr: "35 - 49", de: "35 - 49" }, code: 9 },
      { value: "50_64", label: { it: "50 - 64", en: "50 - 64", es: "50 - 64", fr: "50 - 64", de: "50 - 64" }, code: 10 },
      { value: "over_64", label: { it: "maggiore di 64", en: "Over 64", es: "Más de 64", fr: "Plus de 64", de: "Über 64" }, code: 11 }
    ]
  },
  {
    id: "inclination",
    category: { it: "Interessi", en: "Interests", es: "Intereses", fr: "Centres d'intérêt", de: "Interessen" },
    question: {
      it: "Inclinazione",
      en: "Interests",
      es: "Intereses",
      fr: "Centres d'intérêt",
      de: "Interessen"
    },
    multiple: true,
    options: [
      { value: "adventure", label: { it: "Avventura", en: "Adventure", es: "Aventura", fr: "Aventure", de: "Abenteuer" }, code: 12 },
      { value: "relax", label: { it: "Relax", en: "Relax", es: "Relax", fr: "Détente", de: "Entspannung" }, code: 13 },
      { value: "culture", label: { it: "Cultura", en: "Culture", es: "Cultura", fr: "Culture", de: "Kultur" }, code: 14 },
      { value: "shopping", label: { it: "Shopping", en: "Shopping", es: "Shopping", fr: "Shopping", de: "Shopping" }, code: 15 },
      { value: "nightlife", label: { it: "Night life", en: "Night life", es: "Vida nocturna", fr: "Vie nocturne", de: "Nachtleben" }, code: 16 },
      { value: "foodie", label: { it: "Foodie", en: "Foodie", es: "Foodie", fr: "Foodie", de: "Foodie" }, code: 17 },
      { value: "luxury", label: { it: "Lusso", en: "Luxury", es: "Lujo", fr: "Luxe", de: "Luxus" }, code: 18 }
    ]
  },
  {
    id: "cuisine_style",
    category: { it: "Cucina", en: "Cuisine", es: "Cocina", fr: "Cuisine", de: "Küche" },
    question: {
      it: "Stile di cucina",
      en: "Cuisine Style",
      es: "Estilo de cocina",
      fr: "Style de cuisine",
      de: "Küchenstil"
    },
    multiple: true,
    options: [
      { value: "traditional", label: { it: "Tradizionale", en: "Traditional", es: "Tradicional", fr: "Traditionnel", de: "Traditionell" }, code: 19 },
      { value: "fine_dining", label: { it: "Alta cucina", en: "Fine dining", es: "Alta cocina", fr: "Haute cuisine", de: "Feine Küche" }, code: 20 },
      { value: "fusion", label: { it: "Fusion", en: "Fusion", es: "Fusion", fr: "Fusion", de: "Fusionsküche" }, code: 21 },
      { value: "wine_pairing", label: { it: "Wine paring", en: "Wine paring", es: "Maridaje de vinos", fr: "Accords mets-vins", de: "Weinbegleitung" }, code: 22 },
      { value: "street_food", label: { it: "Street food", en: "Street food", es: "Street food", fr: "Street food", de: "Street food" }, code: 23 }
    ]
  },
  {
    id: "food_preferences",
    category: { it: "Cucina", en: "Cuisine", es: "Cocina", fr: "Cuisine", de: "Küche" },
    question: {
      it: "Preferenza culinaria",
      en: "Food Preferences",
      es: "Preferencias culinarias",
      fr: "Préférences culinaire",
      de: "Kulinarische Vorlieben"
    },
    multiple: true,
    options: [
      { value: "vegan", label: { it: "Vegana", en: "Vegan", es: "Vegano", fr: "Vegan", de: "Vegan" }, code: 24 },
      { value: "vegetarian", label: { it: "Vegetariana", en: "Vegetarian", es: "Vegetariano", fr: "Végétarien", de: "Vegetarisch" }, code: 25 },
      { value: "gluten_free", label: { it: "Senza glutine", en: "Gluten-free", es: "Sin gluten", fr: "Sans gluten", de: "Glutenfrei" }, code: 26 },
      { value: "organic", label: { it: "Biologico", en: "Organic", es: "Orgánico", fr: "Biologique", de: "Bio" }, code: 27 },
      { value: "fish", label: { it: "Pesce", en: "Fish", es: "Pescado", fr: "Poisson", de: "Fisch" }, code: 28 },
      { value: "meat", label: { it: "Carne", en: "Meat", es: "Carne", fr: "Viande", de: "Fleisch" }, code: 29 },
      { value: "brunch", label: { it: "Brunch spot", en: "Brunch spot", es: "Brunch", fr: "Brunch", de: "Brunch" }, code: 30 },
      { value: "quick_bite", label: { it: "Quick Bite", en: "Quick Bite", es: "Quick Bite", fr: "Quick Bite", de: "Quick Bite" }, code: 31 }
    ]
  },
  {
    id: "origin",
    category: { it: "Provenienza", en: "Origin", es: "Procedencia", fr: "Provenance", de: "Herkunft" },
    question: {
      it: "Provenienza",
      en: "Origin",
      es: "Procedencia",
      fr: "Provenance",
      de: "Herkunft"
    },
    options: [
      { value: "europe", label: { it: "Europa", en: "Europe", es: "Europa", fr: "Europe", de: "Europa" }, code: 32 },
      { value: "north_america", label: { it: "Nord America", en: "North America", es: "Norteamérica", fr: "Amérique du Nord", de: "Nord-Amerika" }, code: 33 },
      { value: "south_america", label: { it: "Sud America", en: "South America", es: "América del Sur", fr: "Amérique du Sud", de: "Südamerika" }, code: 34 },
      { value: "asia", label: { it: "Asia", en: "Asia", es: "Asia", fr: "Asie", de: "Asien" }, code: 35 },
      { value: "africa", label: { it: "Africa", en: "Africa", es: "África", fr: "Afrique", de: "Afrika" }, code: 36 },
      { value: "middle_east", label: { it: "Medio Oriente", en: "Middle East", es: "Oriente Próximo", fr: "Moyen-Orient", de: "Naher Osten" }, code: 37 },
      { value: "oceania", label: { it: "Oceania", en: "Oceania", es: "Oceanía", fr: "Océanie", de: "Ozeanien" }, code: 38 }
    ]
  },
  {
    id: "budget",
    category: { it: "Budget", en: "Budget", es: "Presupuesto", fr: "Budget", de: "Budget" },
    question: {
      it: "Budget indicativo",
      en: "Indicative budget",
      es: "Presupuesto orientativo",
      fr: "Budget indicatif",
      de: "Geschätztes Budget"
    },
    options: [
      { value: "low", label: { it: "Basso", en: "Low", es: "Bajo", fr: "Bas", de: "Niedrig" }, code: 39 },
      { value: "medium", label: { it: "Medio", en: "Medium", es: "Medio", fr: "Moyen", de: "Mittel" }, code: 40 },
      { value: "premium", label: { it: "Premium", en: "Premium", es: "Premium", fr: "Premium", de: "Premium" }, code: 41 }
    ]
  },
  {
    id: "duration",
    category: { it: "Durata", en: "Duration", es: "Duración", fr: "Durée", de: "Dauer" },
    question: {
      it: "Tempo di permanenza",
      en: "Length of Stay",
      es: "Duración de la estancia",
      fr: "Durée du séjour",
      de: "Aufenthaltsdauer"
    },
    options: [
      { value: "1_day", label: { it: "1 giorno", en: "1 day", es: "1 día", fr: "1 jour", de: "1 Tag" }, code: 42 },
      { value: "2_days", label: { it: "2 giorni", en: "2 days", es: "2 días", fr: "2 jours", de: "2 Tage" }, code: 43 },
      { value: "3_7_days", label: { it: "3 - 7 giorni", en: "3 - 7 days", es: "3 - 7 días", fr: "3 - 7 jours", de: "3 - 7 Tage" }, code: 44 },
      { value: "over_7_days", label: { it: "Oltre 7 giorni", en: "Over 7 days", es: "Más de 7 días", fr: "Plus de 7 jours", de: "Über 7 Tage" }, code: 45 }
    ]
  },
  {
    id: "composition",
    category: { it: "Composizione", en: "Composition", es: "Composición", fr: "Composition", de: "Zusammensetzung" },
    question: {
      it: "Composizione",
      en: "Group type",
      es: "Composición",
      fr: "Composition",
      de: "Zusammensetzung"
    },
    options: [
      { value: "solo", label: { it: "Solo", en: "Solo", es: "Solo", fr: "Seul(e)", de: "Allein" }, code: 46 },
      { value: "couple", label: { it: "Coppia", en: "Couple", es: "Pareja", fr: "Couple", de: "Paar" }, code: 47 },
      { value: "group", label: { it: "Gruppo", en: "Group", es: "Grupo", fr: "Groupe", de: "Gruppe" }, code: 48 },
      { value: "family", label: { it: "Famiglia", en: "Family", es: "Familia", fr: "Famille", de: "Familia" }, code: 49 }
    ]
  },
  {
    id: "transport",
    category: { it: "Trasporto", en: "Transport", es: "Transporte", fr: "Transport", de: "Transport" },
    question: {
      it: "Mezzo di trasporto",
      en: "Means of Transport",
      es: "Medio de transporte",
      fr: "Moyen de transport",
      de: "Transportmittel"
    },
    options: [
      { value: "own", label: { it: "Proprio", en: "My own", es: "Personnel", fr: "Seul(e)", de: "Eigenes" }, code: 50 },
      { value: "none", label: { it: "Nessuno", en: "None", es: "Ninguno", fr: "Aucun", de: "Keines" }, code: 51 },
      { value: "rental", label: { it: "Vorrei noleggiarlo", en: "I'd like to rent one", es: "Me gustaría alquilar uno", fr: "Je voudrais en louer un", de: "Ich möchte eines mieten" }, code: 52 }
    ]
  }
];

// Funzione per convertire le risposte in array di codici numerici
const convertAnswersToCodes = (answers: Record<string, string | string[]>): number[] => {
  const codes: number[] = [];
  
  Object.entries(answers).forEach(([questionId, answer]) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    if (question.multiple && Array.isArray(answer)) {
      answer.forEach(value => {
        const option = question.options.find(opt => opt.value === value);
        if (option) codes.push(option.code);
      });
    } else if (!question.multiple && typeof answer === 'string') {
      const option = question.options.find(opt => opt.value === answer);
      if (option) codes.push(option.code);
    }
  });
  
  return codes.sort((a, b) => a - b);
};

export default function TravellerPath() {
  const [tpLanguage, setTpLanguage] = useState<TPLanguage>("it");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Load saved answers and language from localStorage and find the first unanswered question
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('traveler-path-intro-seen');
    const savedAnswers = localStorage.getItem('traveler-path-answers');
    const savedLanguage = localStorage.getItem('traveler-path-language');
    
    if (hasSeenIntro) {
      setShowIntro(false);
    }
    
    if (savedLanguage) {
      setTpLanguage(savedLanguage as TPLanguage);
    }
    
    if (savedAnswers) {
      const parsedAnswers = JSON.parse(savedAnswers);
      setAnswers(parsedAnswers);
      
      // Find the first unanswered question
      const firstUnansweredIndex = questions.findIndex(question => {
        const answer = parsedAnswers[question.id];
        return !answer || (question.multiple && (!answer || answer.length === 0));
      });
      
      // If all questions are answered, stay at the last question, otherwise go to first unanswered
      setCurrentQuestionIndex(firstUnansweredIndex === -1 ? questions.length - 1 : firstUnansweredIndex);
    }
    setIsLoaded(true);
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('traveler-path-language', tpLanguage);
    }
  }, [tpLanguage, isLoaded]);

  // Save answers to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('traveler-path-answers', JSON.stringify(answers));
      // Salva anche i codici numerici
      const codes = convertAnswersToCodes(answers);
      localStorage.setItem('traveler-path-codes', JSON.stringify(codes));
      console.log('Codici traveler path salvati:', codes);
    }
  }, [answers, isLoaded]);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  const handleAnswerChange = (value: string) => {
    if (currentQuestion.multiple) {
      const currentAnswers = (currentAnswer as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: newAnswers }));
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).length;
  };

  const isCurrentQuestionAnswered = () => {
    return currentAnswer && (
      currentQuestion.multiple 
        ? (currentAnswer as string[]).length > 0
        : currentAnswer !== ""
    );
  };

  const handleStartQuestionnaire = () => {
    localStorage.setItem('traveler-path-intro-seen', 'true');
    setShowIntro(false);
  };

  const languageLabels = {
    it: "Italiano",
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch"
  };

  // Don't render until data is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e6f7fd]/40 via-white to-[#e6f7fd]/30 flex items-center justify-center">
        <div className="text-[#009fe3]">Loading...</div>
      </div>
    );
  }

  // Show intro screen
  if (showIntro) {
    return (
      <div 
        className="min-h-screen pb-20 flex items-center justify-center relative"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundSize: '400px',
          backgroundRepeat: 'repeat'
        }}
      >
        <div className="absolute inset-0 bg-white/85"></div>
        <div className="max-w-2xl mx-auto px-4 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-[#009fe3] hover:text-[#007bb5] transition-colors mb-8 absolute top-8 left-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>

          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <Compass className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 text-[#009fe3]" />
              <h1 className="text-6xl md:text-7xl font-bebas text-[#006a99] mb-4 tracking-wide">
                TRAVELER PATH
              </h1>
              <p className="text-xl md:text-2xl font-bebas text-[#006a99] tracking-wide max-w-lg mx-auto mb-12">
                Answer a few quick questions and get a <span className="text-black font-bold">personalized</span> selection of places made just for you.
              </p>
            </div>

            <Button
              onClick={handleStartQuestionnaire}
              className="bg-gradient-to-r from-[#009fe3] to-[#007bb5] hover:from-[#008bcc] hover:to-[#006a99] text-white px-12 py-7 text-xl font-bebas rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all tracking-wide"
            >
              INIZIA
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pb-20 relative"
      style={{
        backgroundImage: `url(${patternBg})`,
        backgroundSize: '400px',
        backgroundRepeat: 'repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/90"></div>
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 relative z-10">
        
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <Link to="/" className="inline-flex items-center gap-2 text-[#009fe3] hover:text-[#007bb5] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Select value={tpLanguage} onValueChange={(value) => setTpLanguage(value as TPLanguage)}>
                <SelectTrigger className="w-[140px] h-9 text-xs font-medium border-2 border-primary/20 bg-gradient-to-r from-white/90 to-sky-light/40 backdrop-blur-sm hover:border-ocean-blue hover:shadow-md transition-all rounded-lg">
                  <Globe className="w-3.5 h-3.5 mr-1.5 text-ocean-blue" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-2 border-ocean-blue/30 shadow-xl z-50 rounded-lg">
                  {Object.entries(languageLabels).map(([code, label]) => (
                    <SelectItem 
                      key={code} 
                      value={code} 
                      className="text-xs font-medium cursor-pointer hover:bg-sky-light/50 focus:bg-sky-light/60 transition-colors rounded-md"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                onClick={() => {
                  localStorage.removeItem('traveler-path-intro-seen');
                  setShowIntro(true);
                }}
                className="text-xs font-medium text-primary/60 hover:text-ocean-blue hover:scale-105 transition-all"
              >
                ← Torna all'inizio
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h1 className="text-3xl md:text-4xl font-bebas text-[#006a99] tracking-wide">TRAVELER PATH</h1>
            
            <div className="text-xs md:text-sm text-[#009fe3]/70 font-medium">
              {getAnsweredQuestionsCount()} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-8">
          <div className="w-full bg-[#e6f7fd]/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#009fe3] to-[#007bb5] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-[#b3e5fc]/50 shadow-lg flex flex-col" style={{ minHeight: 'calc(100vh - 250px)' }}>
          
          {/* Category */}
          <div className="mb-4 md:mb-6">
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-[#e6f7fd]/50 text-[#009fe3] rounded-full text-xs md:text-sm font-medium">
              {currentQuestion.category[tpLanguage]}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bebas text-[#006a99] mb-6 md:mb-8 tracking-wide">
            {currentQuestion.question[tpLanguage]}
          </h2>

          {/* Answer Options */}
          <div className="flex-1 mb-6 md:mb-8">
            {currentQuestion.multiple ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 h-full content-start">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center gap-2 p-4 md:p-6 rounded-xl border transition-all cursor-pointer text-center ${
                      (currentAnswer as string[] || []).includes(option.value)
                        ? 'bg-[#009fe3] text-white border-[#009fe3] shadow-md'
                        : 'bg-white/50 text-[#006a99] border-[#b3e5fc]/30 hover:bg-[#e6f7fd]/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(currentAnswer as string[] || []).includes(option.value)}
                      onChange={() => handleAnswerChange(option.value)}
                      className="hidden"
                    />
                    <span className="text-sm md:text-base font-medium">{option.label[tpLanguage]}</span>
                  </label>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={currentAnswer as string || ""}
                onValueChange={handleAnswerChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 h-full content-start"
              >
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center gap-2 p-4 md:p-6 rounded-xl border transition-all cursor-pointer text-center ${
                      currentAnswer === option.value
                        ? 'bg-[#009fe3] text-white border-[#009fe3] shadow-md'
                        : 'bg-white/50 text-[#006a99] border-[#b3e5fc]/30 hover:bg-[#e6f7fd]/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="hidden" />
                    <span className="text-sm md:text-base font-medium">{option.label[tpLanguage]}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="h-9 px-3 md:h-10 md:px-4"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="text-[#009fe3] text-xs md:text-sm h-9 px-3 md:h-10 md:px-4"
                size="sm"
              >
                Skip
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => {
                    const codes = convertAnswersToCodes(answers);
                    alert(`Traveler Path completato! I tuoi codici: ${codes.join(', ')}`);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-9 px-3 md:h-10 md:px-4 text-xs md:text-sm"
                  size="sm"
                >
                  <Check className="w-4 h-4" />
                  Completa
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="h-9 px-3 md:h-10 md:px-4"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-6 md:mt-8 flex justify-center">
          <div className="flex gap-1.5 md:gap-2 flex-wrap justify-center max-w-full px-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all flex-shrink-0 ${
                  index === currentQuestionIndex
                    ? 'bg-[#009fe3] scale-125'
                    : answers[questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-[#b3e5fc]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}