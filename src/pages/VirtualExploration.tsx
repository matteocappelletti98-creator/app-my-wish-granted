import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tuo CSV pubblicato
const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function VirtualExploration() {
  const { t } = useLanguage();
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [overlay, setOverlay] = useState(false); // fullscreen overlay
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userTravellerCodes, setUserTravellerCodes] = useState<number[]>([]);

  // Carica preferiti dal localStorage
  useEffect(() => {
    const saved = localStorage.getItem('explore-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Salva preferiti nel localStorage
  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('explore-favorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (placeId: string) => {
    const newFavorites = favorites.includes(placeId)
      ? favorites.filter(id => id !== placeId)
      : [...favorites, placeId];
    saveFavorites(newFavorites);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlacesFromSheet(CSV_URL);
        setAll(data.filter(p => p.status === "published"));
      } finally {
        setLoading(false);
      }
    })();
    
    // Carica i codici traveller path salvati
    const savedCodes = localStorage.getItem('traveller-path-codes');
    if (savedCodes) {
      try {
        const codes = JSON.parse(savedCodes);
        setUserTravellerCodes(codes);
      } catch (err) {
        console.error("Errore caricamento codici traveller path:", err);
      }
    }
  }, []);

  const categories = useMemo(() => {
    const s = new Set(all.map(p => normalizeCategory(p.category)).filter(Boolean));
    return Array.from(s);
  }, [all]);

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return all.filter(p => {
      const t = `${p.name} ${p.city} ${p.description}`.toLowerCase();
      const okText = !needle || t.includes(needle);
      const okCat = selectedCategories.length === 0 || selectedCategories.some(cat => normalizeCategory(p.category) === cat);
      return okText && okCat;
    });
  }, [all, search, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Filtra solo i luoghi preferiti per la lista
  const favoritesList = useMemo(() => {
    return all.filter(p => favorites.includes(p.id));
  }, [all, favorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header stile home */}
      <header className="px-6 py-12 border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide text-gray-900">
              Exploration
            </h1>
          </div>
        </div>
      </header>

      {/* Corpo: mappa + categorie */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-4 pt-4">
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-[70vh] w-full rounded-2xl border bg-slate-50" />
            ) : (
              <MapView 
                places={all.filter(p => p.status === "published")} 
                selectedCategories={selectedCategories} 
                className="h-[70vh] w-full rounded-2xl border"
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                userTravellerCodes={userTravellerCodes}
              />
            )}
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border p-4 bg-white">
              <h3 className="font-semibold mb-2">{t('categories.title')}</h3>
              <ScrollArea className="h-[400px]">
                <div className="flex flex-col gap-2 pr-4">
                  <button onClick={() => setSelectedCategories([])}
                    className={`text-left rounded-xl px-3 py-2 border ${selectedCategories.length === 0 ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
                    {t('categories.all')}
                  </button>
                  {categories.map(c => (
                    <button key={c} onClick={() => toggleCategory(c)}
                      className={`text-left rounded-xl px-3 py-2 border flex items-center gap-2
                      ${selectedCategories.includes(c) ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
                      <CategoryBadge category={c} />
                      <span className="text-sm">{c}</span>
                      <span className="text-xs bg-blue-200/30 px-1 rounded">
                        {all.filter(p => normalizeCategory(p.category) === c).length}
                      </span>
                      {selectedCategories.includes(c) && (
                        <span className="ml-auto text-xs bg-white/20 px-1 rounded">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </aside>
        </div>
      </section>

      {/* I tuoi luoghi preferiti */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold text-blue-600">My favorites</h2>
            <span className="text-sm text-gray-500">({favorites.length})</span>
          </div>
          
          {favoritesList.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">{t('virtualExploration.noFavorites')}</p>
              <p className="text-sm">{t('virtualExploration.noFavoritesDescription')}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoritesList.map(p => (
                <div key={p.id} className="relative">
                  <PlaceCard place={p} />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <a
                      href={`/luogo/${p.slug}`}
                      className="p-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors"
                      title={t('virtualExploration.visit')}
                    >
                      <span className="text-xs">👁️</span>
                    </a>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + (p.address || p.city || ''))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700 transition-colors"
                      title={t('virtualExploration.maps')}
                    >
                      <span className="text-xs">🗺️</span>
                    </a>
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                      title={t('virtualExploration.removeFromFavorites')}
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </button>
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