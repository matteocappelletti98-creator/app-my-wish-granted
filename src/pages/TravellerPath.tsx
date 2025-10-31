import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: string; label: string; code: number }[];
  multiple?: boolean;
}

const questions: Question[] = [
  // Profilo
  {
    id: "profile_type",
    category: "Profilo",
    question: "Sei un Local o un Traveler?",
    options: [
      { value: "local", label: "Local", code: 1 },
      { value: "traveler", label: "Traveler", code: 2 }
    ]
  },
  {
    id: "gender",
    category: "Profilo",
    question: "Genere",
    options: [
      { value: "male", label: "Maschio", code: 10 },
      { value: "female", label: "Femmina", code: 11 },
      { value: "other", label: "Altro", code: 12 }
    ]
  },
  {
    id: "age",
    category: "Profilo",
    question: "Età",
    options: [
      { value: "under_18", label: "<18", code: 20 },
      { value: "18_24", label: "18–24", code: 21 },
      { value: "25_34", label: "25–34", code: 22 },
      { value: "35_49", label: "35–49", code: 23 },
      { value: "50_64", label: "50–64", code: 24 },
      { value: "over_65", label: ">65", code: 25 }
    ]
  },
  {
    id: "nationality",
    category: "Profilo",
    question: "Nazionalità",
    options: [
      { value: "europe", label: "Europa", code: 90 },
      { value: "usa", label: "USA", code: 91 },
      { value: "south_america", label: "Sud America", code: 92 },
      { value: "asia", label: "Asia", code: 93 },
      { value: "africa", label: "Africa", code: 94 },
      { value: "middle_east", label: "Middle East", code: 95 }
    ]
  },
  // Composizione del viaggio
  {
    id: "travel_composition",
    category: "Composizione del viaggio",
    question: "Composizione",
    options: [
      { value: "solo", label: "Solo", code: 110 },
      { value: "couple", label: "Coppia", code: 111 },
      { value: "group", label: "Gruppo", code: 112 },
      { value: "family", label: "Famiglia", code: 113 }
    ]
  },
  {
    id: "budget",
    category: "Budget",
    question: "Budget indicativo",
    options: [
      { value: "low", label: "Low", code: 120 },
      { value: "medium", label: "Medium", code: 121 },
      { value: "premium", label: "Premium", code: 122 }
    ]
  },
  // Viaggio
  {
    id: "travel_inclination",
    category: "Viaggio",
    question: "Inclinazione",
    multiple: true,
    options: [
      { value: "adventure", label: "Avventura", code: 30 },
      { value: "relax", label: "Relax", code: 31 },
      { value: "culture", label: "Cultura", code: 32 },
      { value: "shopping", label: "Shopping", code: 33 },
      { value: "nightlife", label: "Nightlife", code: 34 },
      { value: "socializing", label: "Socializing", code: 35 }
    ]
  },
  {
    id: "duration",
    category: "Viaggio",
    question: "Tempo di permanenza",
    options: [
      { value: "1_day", label: "1 giorno", code: 40 },
      { value: "2_days", label: "2 giorni", code: 41 },
      { value: "3_7_days", label: "3–7 giorni", code: 42 },
      { value: "over_7_days", label: ">7 giorni", code: 43 }
    ]
  },
  {
    id: "transport",
    category: "Viaggio",
    question: "Mezzo di trasporto",
    multiple: true,
    options: [
      { value: "own", label: "Proprio", code: 70 },
      { value: "none", label: "No", code: 71 },
      { value: "rental", label: "Vorrei noleggiarlo", code: 72 }
    ]
  },
  // Cucina
  {
    id: "cuisine",
    category: "Cucina / preferenze culinarie",
    question: "Preferenze culinarie",
    multiple: true,
    options: [
      { value: "homemade", label: "Casereccia", code: 50 },
      { value: "fine_dining", label: "Fine dining", code: 51 },
      { value: "healthy", label: "Healthy", code: 52 },
      { value: "wine_pairing", label: "Wine pairing", code: 53 },
      { value: "street_food", label: "Street food", code: 54 },
      { value: "vegan", label: "Vegano", code: 80 },
      { value: "vegetarian", label: "Vegetariano", code: 81 },
      { value: "gluten_free", label: "Gluten free", code: 82 },
      { value: "organic", label: "Organic", code: 83 },
      { value: "dairy_free", label: "Dairy free", code: 84 },
      { value: "halal", label: "Halal", code: 85 },
      { value: "nuts_free", label: "Nuts free", code: 86 }
    ]
  },
  // Alloggio
  {
    id: "accommodation_zone",
    category: "Alloggio",
    question: "Zona di pernottamento",
    options: [
      { value: "z1", label: "Z1", code: 60 },
      { value: "z2", label: "Z2", code: 61 },
      { value: "z3", label: "Z3", code: 62 },
      { value: "z4", label: "Z4", code: 63 },
      { value: "z5", label: "Z5", code: 64 }
    ]
  },
  // Accessibilità
  {
    id: "accessibility",
    category: "Accessibilità / categorie fragili",
    question: "Necessità specifiche",
    multiple: true,
    options: [
      { value: "reduced_mobility", label: "Mobilità ridotta", code: 100 },
      { value: "odorophobia", label: "Odorofobia", code: 101 },
      { value: "elderly", label: "Anziani", code: 102 },
      { value: "pregnant", label: "Donne incinta", code: 103 },
      { value: "mental_wellness", label: "Benessere mentale", code: 104 }
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
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved answers from localStorage and find the first unanswered question
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
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

  // Save answers to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('traveller-path-answers', JSON.stringify(answers));
      // Salva anche i codici numerici
      const codes = convertAnswersToCodes(answers);
      localStorage.setItem('traveller-path-codes', JSON.stringify(codes));
      console.log('Codici traveller path salvati:', codes);
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

  // Don't render until data is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 flex items-center justify-center">
        <div className="text-blue-600">{t('travellerPath.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-4 md:py-8">
        
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3 md:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Home</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bebas text-blue-900 mb-1 tracking-wide">TRAVELLER PATH</h1>
              {getAnsweredQuestionsCount() > 0 && getAnsweredQuestionsCount() < questions.length && (
                <p className="text-orange-600 text-xs md:text-sm flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  In corso...
                </p>
              )}
            </div>
            
            <div className="text-xs md:text-sm text-blue-600/70 font-medium">
              {getAnsweredQuestionsCount()} / {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 md:mb-8">
          <div className="w-full bg-blue-100/50 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-blue-100/50 shadow-lg">
          
          {/* Category */}
          <div className="mb-4 md:mb-6">
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-blue-100/50 text-blue-700 rounded-full text-xs md:text-sm font-medium">
              {currentQuestion.category}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-bebas text-blue-900 mb-6 md:mb-8 tracking-wide">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="mb-6 md:mb-8">
            {currentQuestion.multiple ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl border transition-all cursor-pointer text-center ${
                      (currentAnswer as string[] || []).includes(option.value)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white/50 text-blue-900 border-blue-100/30 hover:bg-blue-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={(currentAnswer as string[] || []).includes(option.value)}
                      onChange={() => handleAnswerChange(option.value)}
                      className="hidden"
                    />
                    <span className="text-sm md:text-base font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            ) : (
              <RadioGroup
                value={currentAnswer as string || ""}
                onValueChange={handleAnswerChange}
                className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3"
              >
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center gap-2 p-3 md:p-4 rounded-xl border transition-all cursor-pointer text-center ${
                      currentAnswer === option.value
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white/50 text-blue-900 border-blue-100/30 hover:bg-blue-50/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="hidden" />
                    <span className="text-sm md:text-base font-medium">{option.label}</span>
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
                className="text-blue-600 text-xs md:text-sm h-9 px-3 md:h-10 md:px-4"
                size="sm"
              >
                Skip
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => {
                    const codes = convertAnswersToCodes(answers);
                    alert(`Traveller Path completato! I tuoi codici: ${codes.join(', ')}`);
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