import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { Search, Filter } from "lucide-react";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Luoghi() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

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
      const okCat = !selectedCategory || normalizeCategory(p.category) === selectedCategory;
      return okText && okCat;
    });
  }, [all, q, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30">
        <div className="px-6 py-12 text-center">
          <div className="text-blue-600 font-light tracking-wide">Caricamento...</div>
        </div>
      </div>
    );
  }

  return (
    <div key="luoghi-page-v3" className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30">
      {/* Header */}
      <header className="px-6 py-12 text-center border-b border-blue-100/30">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-light text-blue-900 mb-3 tracking-wide">Luoghi</h1>
          <p className="text-lg text-blue-700/70 font-light tracking-wide">Scopri tutti i luoghi pubblicati</p>
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
                  placeholder="Cerca luoghi..." 
                  value={q} 
                  onChange={(e) => setQ(e.target.value)} 
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-xl border transition-all font-light tracking-wide ${
                    selectedCategory === "" 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  Tutte
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                    className={`px-4 py-2 rounded-xl border transition-all font-light tracking-wide flex items-center gap-2 ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white/80 text-blue-700 border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <CategoryBadge category={cat} />
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-blue-100/30">
              <div className="text-blue-400 mb-3">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-light text-blue-900 mb-2">Nessun luogo trovato</h3>
              <p className="text-blue-700/70 font-light">Prova a modificare i filtri di ricerca</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <Link key={i} to={`/luogo/${p.slug}`} className="group">
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100/50 overflow-hidden hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col cursor-pointer">
                    {/* Image */}
                    <div className="aspect-square overflow-hidden">
                      {p.image ? (
                        <img 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                          src={p.image} 
                          alt={p.name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-50/80 flex items-center justify-center">
                          <span className="text-blue-300 text-4xl">📍</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-lg font-light text-blue-900 tracking-wide leading-tight flex-1">{p.name}</h2>
                        {p.category && (
                          <div className="ml-2 flex-shrink-0">
                            <CategoryBadge category={p.category} />
                          </div>
                        )}
                      </div>
                      
                      {(p.city || p.country) && (
                        <p className="text-sm text-blue-600/70 font-light mb-3">
                          {p.city}{p.city && p.country ? ", " : ""}{p.country}
                        </p>
                      )}
                      
                      {p.description && (
                        <p className="text-sm text-blue-700/80 font-light line-clamp-3 flex-1">{p.description}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}