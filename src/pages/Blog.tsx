import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAllArticles, type ArticleMeta } from "@/lib/articles";
import { Link } from "react-router-dom";
import blogHero from "@/assets/blog-hero.png";

export default function Blog() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<("faq" | "daytrip" | "tip" | "city+")[]>(["faq"]);
  
  const toggleCategory = (category: "faq" | "daytrip" | "tip" | "city+") => {
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
    tip: allArticles.filter(a => a.tipo === 'tip'),
    "city+": allArticles.filter(a => a.tipo === 'city+')
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
          <p className="text-[#009fe3]/70 text-base sm:text-lg font-light px-4">
            {searchQuery.trim() ? "Nessun articolo trovato per la ricerca" : "Nessun articolo disponibile in questa categoria"}
          </p>
        </div>
      ) : (
        filteredArticles.map(article => (
          <Link key={article.id} to={`/articolo/${article.slug}`}>
            <Card className="group overflow-hidden bg-white/60 backdrop-blur-lg border border-[#b3e5fc]/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-[#e6f7fd]/20 transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 rounded-3xl h-full">
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
                <CardTitle className="text-base sm:text-lg font-light leading-tight text-[#006a99] hover:text-[#009fe3] cursor-pointer transition-colors duration-300 tracking-wide">
                  {article.titolo}
                </CardTitle>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-[#e6f7fd]/50 text-[#009fe3]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3 pt-0 px-4 sm:px-6 pb-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#009fe3]/60">
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
                
                <div className="flex items-center justify-between pt-3 border-t border-[#b3e5fc]/30">
                  <div className="flex items-center gap-3 text-xs text-[#009fe3]/60">
                    <Badge variant="outline" className="text-xs border-[#b3e5fc] text-[#009fe3]">
                      {article.tipo}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white/80 border-[#b3e5fc]/50 text-[#009fe3] hover:bg-[#009fe3] hover:text-white hover:border-[#009fe3] transition-all duration-300 rounded-xl font-light text-xs sm:text-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7fd]/40 via-white to-[#e6f7fd]/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#b3e5fc]/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#b3e5fc]/30 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        <img 
          src={blogHero} 
          alt="To be a True Local" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-sm border-b border-[#b3e5fc]/50">
        <div className="px-4 sm:px-6 py-8 sm:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bebas font-normal text-[#006a99] tracking-wider mb-6 sm:mb-8">
                Blog
              </h1>
              
              {/* Category Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-4 sm:px-0">
                <Button 
                  onClick={() => toggleCategory("faq")}
                  className={`w-full sm:w-auto font-bebas font-normal tracking-wide transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl ${
                    selectedCategories.includes("faq") 
                      ? "bg-gradient-to-r from-[#009fe3] to-[#007bb5] text-white hover:from-[#008bcc] hover:to-[#006a99]" 
                      : "bg-white/80 text-[#009fe3] border border-[#b3e5fc] hover:bg-[#e6f7fd]"
                  }`}
                >
                  day trip
                </Button>
                <Button 
                  onClick={() => toggleCategory("city+")}
                  className={`w-full sm:w-auto font-bebas font-normal tracking-wide transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl ${
                    selectedCategories.includes("city+") 
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
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#009fe3]/40 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 sm:pl-12 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-[#b3e5fc]/50 rounded-2xl text-[#006a99] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#b3e5fc] focus:border-[#009fe3] transition-all font-light"
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
                category === "city+" ? articles["city+"] :
                articles.tip
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}