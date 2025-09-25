import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { Search, Filter, MapPin, ExternalLink } from "lucide-react";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { useLanguage } from "@/contexts/LanguageContext";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Luoghi() {
  const { t } = useLanguage();
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlacesFromSheet(CSV_URL);
        setAll(data.filter(p => p.status === "published"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => {
    const s = new Set(all.map(p => normalizeCategory(p.category)).filter(Boolean));
    return Array.from(s);
  }, [all]);

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return all.filter(p => {
      const t = (p.name + p.city + p.description).toLowerCase();
      const okText = !needle || t.includes(needle);
      const okCat = selectedCategories.length === 0 || selectedCategories.some(cat => normalizeCategory(p.category) === cat);
      
      // Sub-filter logic for restaurants
      let okSubFilter = true;
      if (selectedCategories.includes('restaurant') && selectedSubFilters.length > 0) {
        const desc = p.description.toLowerCase();
        okSubFilter = selectedSubFilters.some(subFilter => {
          if (subFilter === 'carne') return desc.includes('carne') || desc.includes('bistecca') || desc.includes('manzo') || desc.includes('agnello') || desc.includes('maiale');
          if (subFilter === 'pesce') return desc.includes('pesce') || desc.includes('mare') || desc.includes('salmone') || desc.includes('branzino') || desc.includes('orata') || desc.includes('seafood');
          return false;
        });
      }
      
      return okText && okCat && okSubFilter;
    });
  }, [all, q, selectedCategories, selectedSubFilters]);

  // Luoghi che hanno una pagina dedicata (solo alcuni selezionati)
  const placesWithDedicatedPage = [
    'caffe-e-caffe-como',
    'duomo-di-como-como',
    'fornaio-beretta-como'
  ];

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // Reset sub-filters when changing categories
    if (category !== 'restaurant') {
      setSelectedSubFilters([]);
    }
  };

  const toggleSubFilter = (subFilter: string) => {
    setSelectedSubFilters(prev => 
      prev.includes(subFilter)
        ? prev.filter(f => f !== subFilter)
        : [...prev, subFilter]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30">
        <div className="px-6 py-12 text-center">
          <div className="text-blue-600 font-light tracking-wide">{t('places.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div key="luoghi-page-v3" className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30">
      {/* Header */}
      <header className="px-6 py-12 text-center border-b border-blue-100/30">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="text-4xl font-light text-blue-900 tracking-wide">{t('places.title')}</h1>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium tracking-wide">
              Explore Approved
            </div>
          </div>
          <p className="text-lg text-blue-700/70 font-light tracking-wide">{t('places.subtitle')}</p>
        </div>
      </header>

      {/* Filters */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-blue-900 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-light" 
                  placeholder={t('places.searchPlaceholder')} 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                />
              </div>
              
              {/* Category Filter - Modern Floating Cards */}
              <div className="space-y-3">
                <div className="text-sm font-medium text-blue-700">{t('places.categories')}</div>
                <div className="flex flex-wrap gap-3">
                  {/* All Categories Card */}
                  <div
                    onClick={() => {
                      setSelectedCategories([]);
                      setSelectedSubFilters([]);
                    }}
                    className={`group cursor-pointer relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedCategories.length === 0
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50" 
                        : "bg-white/90 backdrop-blur-sm text-blue-700 border border-blue-100 hover:bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center min-w-[80px]">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        selectedCategories.length === 0 
                          ? "bg-white/20" 
                          : "bg-blue-50 group-hover:bg-blue-100"
                      } transition-colors`}>
                        <span className="text-2xl">🌟</span>
                      </div>
                      <div className="text-xs font-medium">{t('categories.all')}</div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                        selectedCategories.length === 0 
                          ? "bg-white/20 text-white" 
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {all.length}
                      </div>
                    </div>
                    {selectedCategories.length === 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-blue-600 text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Category Cards */}
                  {categories.map(cat => (
                    <div
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`group cursor-pointer relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedCategories.includes(cat)
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200/50"
                          : "bg-white/90 backdrop-blur-sm text-blue-700 border border-blue-100 hover:bg-white hover:border-blue-200"
                      }`}
                    >
                      <div className="flex flex-col items-center text-center min-w-[80px]">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          selectedCategories.includes(cat) 
                            ? "bg-white/20" 
                            : "bg-blue-50 group-hover:bg-blue-100"
                        } transition-colors`}>
                          <CategoryBadge category={cat} />
                        </div>
                        <div className="text-xs font-medium capitalize">{cat}</div>
                        <div className={`text-xs mt-1 px-2 py-0.5 rounded-full ${
                          selectedCategories.includes(cat) 
                            ? "bg-white/20 text-white" 
                            : "bg-blue-100 text-blue-600"
                        }`}>
                          {all.filter(p => normalizeCategory(p.category) === cat).length}
                        </div>
                      </div>
                      {selectedCategories.includes(cat) && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md animate-scale-in">
                          <span className="text-blue-600 text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sub-filters for restaurants - Modern Pills */}
              {selectedCategories.includes('restaurant') && (
                <div className="space-y-2 mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 animate-fade-in">
                  <div className="text-sm font-medium text-blue-700">{t('places.cuisineType')}</div>
                  <div className="flex flex-wrap gap-2">
                    {['carne', 'pesce'].map(subFilter => (
                      <button
                        key={subFilter}
                        onClick={() => toggleSubFilter(subFilter)}
                        className={`px-4 py-2 rounded-full border-2 transition-all duration-200 text-sm font-medium hover:scale-105 ${
                          selectedSubFilters.includes(subFilter)
                            ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200/50"
                            : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                      >
                        <span className="mr-2">{subFilter === 'carne' ? '🥩' : '🐟'}</span>
                        {subFilter.charAt(0).toUpperCase() + subFilter.slice(1)}
                        {selectedSubFilters.includes(subFilter) && (
                          <span className="ml-2 w-4 h-4 bg-white/20 rounded-full inline-flex items-center justify-center text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-100/30">
              <div className="text-blue-400 mb-3">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-light text-blue-900 mb-2">{t('places.noPlacesFound')}</h3>
              <p className="text-blue-700/70 font-light">{t('places.tryModifyFilters')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((p, i) => (
                <div key={i} className="group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 overflow-hidden hover:bg-white/90 hover:shadow-lg hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {/* Image - più piccola */}
                    <div className="aspect-[4/3] overflow-hidden">
                      {p.image ? (
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          src={p.image} 
                          alt={p.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-50/80 flex items-center justify-center">
                          <span className="text-blue-300 text-2xl">📍</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content - più compatto */}
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="text-sm font-medium text-blue-900 tracking-wide leading-tight flex-1 line-clamp-2">{p.name}</h2>
                        {p.category && (
                          <div className="ml-1 flex-shrink-0">
                            <CategoryBadge category={p.category} />
                          </div>
                        )}
                      </div>
                      
                      {(p.city || p.country) && (
                        <div className="text-xs text-blue-600/70 font-light mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="line-clamp-1">
                              {p.city}{p.city && p.country ? ", " : ""}{p.country}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {p.description && (
                        <p className="text-xs text-blue-700/80 font-light line-clamp-2 flex-1 mb-2">{p.description}</p>
                      )}

                      {/* Pulsanti azione - più compatti */}
                      <div className="mt-auto space-y-1">
                        {/* Pulsante Google Maps */}
                        {(p.address || p.city) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const query = encodeURIComponent(p.address || `${p.name}, ${p.city}, ${p.country}`);
                              window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                            }}
                            className="w-full px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                            {t('places.maps')}
                          </button>
                        )}
                        
                        {/* Bottone dedicato solo per alcuni luoghi */}
                        {placesWithDedicatedPage.includes(p.id) && (
                          <Link 
                            to={`/luogo/${p.slug}`}
                            className="block w-full px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                          >
                            {t('places.enter')}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}