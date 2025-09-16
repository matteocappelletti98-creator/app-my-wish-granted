import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: string; label: string }[];
  multiple?: boolean;
}

const questions: Question[] = [
  // Profilo
  {
    id: "profile_type",
    category: "Profilo",
    question: "Sei un Local o un Traveler?",
    options: [
      { value: "local", label: "Local" },
      { value: "traveler", label: "Traveler" }
    ]
  },
  {
    id: "gender",
    category: "Profilo",
    question: "Genere",
    options: [
      { value: "male", label: "Maschio" },
      { value: "female", label: "Femmina" },
      { value: "other", label: "Altro" }
    ]
  },
  {
    id: "age",
    category: "Profilo",
    question: "Età",
    options: [
      { value: "under_18", label: "<18" },
      { value: "18_24", label: "18–24" },
      { value: "25_34", label: "25–34" },
      { value: "35_49", label: "35–49" },
      { value: "50_64", label: "50–64" },
      { value: "over_65", label: ">65" }
    ]
  },
  {
    id: "nationality",
    category: "Profilo",
    question: "Nazionalità",
    options: [
      { value: "europe", label: "Europa" },
      { value: "usa", label: "USA" },
      { value: "south_america", label: "Sud America" },
      { value: "asia", label: "Asia" },
      { value: "africa", label: "Africa" }
    ]
  },
  // Composizione del viaggio
  {
    id: "travel_composition",
    category: "Composizione del viaggio",
    question: "Composizione",
    options: [
      { value: "solo", label: "Solo" },
      { value: "couple", label: "Coppia" },
      { value: "group", label: "Gruppo" },
      { value: "family", label: "Famiglia" }
    ]
  },
  // Viaggio
  {
    id: "travel_inclination",
    category: "Viaggio",
    question: "Inclinazione",
    options: [
      { value: "adventure", label: "Avventura" },
      { value: "relax", label: "Relax" },
      { value: "culture", label: "Cultura" },
      { value: "shopping", label: "Shopping" },
      { value: "nightlife", label: "Nightlife" },
      { value: "socializing", label: "Socializing" }
    ]
  },
  {
    id: "duration",
    category: "Viaggio",
    question: "Tempo di permanenza",
    options: [
      { value: "1_day", label: "1 giorno" },
      { value: "2_days", label: "2 giorni" },
      { value: "3_7_days", label: "3–7 giorni" },
      { value: "over_7_days", label: ">7 giorni" }
    ]
  },
  {
    id: "transport",
    category: "Viaggio",
    question: "Mezzo di trasporto",
    options: [
      { value: "own", label: "Proprio" },
      { value: "none", label: "No" },
      { value: "rental", label: "Vorrei noleggiarlo" }
    ]
  },
  // Cucina
  {
    id: "cuisine",
    category: "Cucina / preferenze culinarie",
    question: "Preferenze culinarie",
    multiple: true,
    options: [
      { value: "homemade", label: "Casereccia" },
      { value: "fine_dining", label: "Fine dining" },
      { value: "healthy", label: "Healthy" },
      { value: "wine_pairing", label: "Wine pairing" },
      { value: "street_food", label: "Street food" },
      { value: "organic", label: "Organic" },
      { value: "dairy_free", label: "Dairy free" },
      { value: "halal", label: "Halal" },
      { value: "nuts_free", label: "Nuts free" },
      { value: "gluten_free", label: "Gluten free" },
      { value: "vegan", label: "Vegano" },
      { value: "vegetarian", label: "Vegetariano" }
    ]
  },
  // Alloggio
  {
    id: "accommodation_zone",
    category: "Alloggio",
    question: "Zona di pernottamento",
    options: [
      { value: "z1", label: "Z1" },
      { value: "z2", label: "Z2" },
      { value: "z3", label: "Z3" },
      { value: "z4", label: "Z4" },
      { value: "z5", label: "Z5" }
    ]
  },
  // Accessibilità
  {
    id: "accessibility",
    category: "Accessibilità / categorie fragili",
    question: "Necessità specifiche",
    multiple: true,
    options: [
      { value: "reduced_mobility", label: "Mobilità ridotta" },
      { value: "elderly", label: "Anziani" },
      { value: "pregnant", label: "Donne incinta" },
      { value: "odorophobia", label: "Odorofobia" },
      { value: "mental_wellness", label: "Benessere mentale" }
    ]
  }
];

export default function TravellerPath() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('traveller-path-answers', JSON.stringify(answers));
  }, [answers]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-blue-900 mb-2">Traveller.Path</h1>
              <p className="text-blue-600/70">Crea il tuo itinerario personalizzato</p>
            </div>
            
            <div className="text-sm text-blue-600/70">
              {getAnsweredQuestionsCount()} / {questions.length} domande completate
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-600/70">Progresso</span>
            <span className="text-sm text-blue-600/70">
              {Math.round((currentQuestionIndex + 1) / questions.length * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-100/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-blue-100/50 shadow-lg">
          
          {/* Category */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100/50 text-blue-700 rounded-full text-sm font-medium">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-light text-blue-900 mb-8">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="mb-8">
            {currentQuestion.multiple ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-blue-100/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(currentAnswer as string[] || []).includes(option.value)}
                      onChange={() => handleAnswerChange(option.value)}
                      className="w-4 h-4 text-blue-600 rounded border-blue-300 focus:ring-blue-200"
                    />
                    <span className="text-blue-900">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={currentAnswer as string || ""}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-4 bg-white/50 rounded-xl border border-blue-100/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value={option.value} />
                    <span className="text-blue-900">{option.label}</span>
                  </label>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Precedente
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="text-blue-600"
              >
                Salta
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => alert('Questionario completato! I tuoi dati sono stati salvati.')}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Check className="w-4 h-4" />
                  Completa
                </Button>
              ) : (
                <Button
                  onClick={goToNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2"
                >
                  Successiva
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-8 flex justify-center">
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 scale-125'
                    : answers[questions[index].id]
                    ? 'bg-green-500'
                    : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}