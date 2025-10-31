import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, Languages } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { getAllArticles, type ArticleMeta } from "@/lib/articles";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Blog() {
  const { t, language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<("faq" | "daytrip" | "tip")[]>(["faq"]);

  const languageLabels: Record<Language, string> = {
    it: "🇮🇹 Italiano",
    en: "🇬🇧 English",
    fr: "🇫🇷 Français",
    de: "🇩🇪 Deutsch",
    es: "🇪🇸 Español",
  };
  
  const toggleCategory = (category: "faq" | "daytrip" | "tip") => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  // Carica gli articoli reali dal sistema markdown con la lingua selezionata
  const allArticles = getAllArticles(language);
  
  // Raggruppa articoli per tipo
  const articles = {
    faq: allArticles.filter(a => a.tipo === 'faq'),
    daytrip: allArticles.filter(a => a.tipo === 'daytrip'), 
    tip: allArticles.filter(a => a.tipo === 'tip')
  };

  // Filtra gli articoli in base alla ricerca
  const filterArticles = (categoryArticles: ArticleMeta[]) => {
    if (!searchQuery.trim()) return categoryArticles;
    
    const query = searchQuery.toLowerCase().trim();
    return categoryArticles.filter(article => 
      article.titolo.toLowerCase().includes(query) ||
      article.autore?.toLowerCase().includes(query) ||
      article.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  };

  const renderArticles = (categoryArticles: ArticleMeta[]) => {
    const filteredArticles = filterArticles(categoryArticles);
    
    return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredArticles.length === 0 ? (
        <div className="col-span-full text-center py-8 sm:py-12">
          <p className="text-blue-700/70 text-base sm:text-lg font-light px-4">
            {searchQuery.trim() ? "Nessun articolo trovato per la ricerca" : "Nessun articolo disponibile in questa categoria"}
          </p>
        </div>
      ) : (
        filteredArticles.map(article => (
          <Link key={article.id} to={`/articolo/${article.slug}`}>
            <Card className="group overflow-hidden bg-white/60 backdrop-blur-lg border border-blue-100/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 rounded-3xl h-full">
              {article.cover && (
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={article.cover} 
                    alt={article.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg font-light leading-tight text-blue-900 hover:text-blue-600 cursor-pointer transition-colors duration-300 tracking-wide">
                  {article.titolo}
                </CardTitle>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-blue-100/50 text-blue-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-0 px-4 sm:px-6 pb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-blue-600/60">
                  {article.autore && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="font-light">{article.autore}</span>
                    </div>
                  )}
                  {article.data && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="font-light">{article.data}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-blue-100/30">
                  <div className="flex items-center gap-3 text-xs text-blue-600/60">
                    <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                      {article.tipo}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white/80 border-blue-100/50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 rounded-xl font-light text-xs sm:text-sm">
                    {t('blog.read')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-sm border-b border-blue-100/50">
        <div className="px-4 sm:px-6 py-8 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-8 sm:mb-16">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bebas font-normal text-blue-900 tracking-wider">
                  Blog
                </h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/80 backdrop-blur-sm border-blue-100/50 hover:bg-blue-50 rounded-2xl px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
                    >
                      <Languages className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      {languageLabels[language]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-blue-100/50 rounded-xl">
                    {(Object.keys(languageLabels) as Language[]).map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`cursor-pointer rounded-lg px-4 py-3 text-base ${
                          language === lang 
                            ? "bg-blue-100/50 text-blue-900 font-medium" 
                            : "text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        {languageLabels[lang]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Category Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-4 sm:px-0">
                <Button 
                  onClick={() => toggleCategory("faq")}
                  className={`w-full sm:w-auto font-bebas font-normal tracking-wide transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl ${
                    selectedCategories.includes("faq") 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700" 
                      : "bg-white/80 text-blue-600 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  FAQ
                </Button>
                <Button 
                  onClick={() => toggleCategory("daytrip")}
                  className={`w-full sm:w-auto font-bebas font-normal tracking-wide transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl ${
                    selectedCategories.includes("daytrip") 
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700" 
                      : "bg-white/80 text-green-600 border border-green-200 hover:bg-green-50"
                  }`}
                >
                  City+
                </Button>
                <Button 
                  onClick={() => toggleCategory("tip")}
                  className={`w-full sm:w-auto font-bebas font-normal tracking-wide transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl ${
                    selectedCategories.includes("tip") 
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700" 
                      : "bg-white/80 text-purple-600 border border-purple-200 hover:bg-purple-50"
                  }`}
                >
                  Tips
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto px-4 sm:px-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600/40 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-blue-100/50 rounded-2xl text-blue-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-light"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Render articles based on selected categories */}
          <div className="space-y-8">
            {renderArticles(
              selectedCategories.flatMap(category => 
                category === "faq" ? articles.faq : 
                category === "daytrip" ? articles.daytrip : 
                articles.tip
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}