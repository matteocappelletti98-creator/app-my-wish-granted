import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
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

  // Mapping dei titoli delle categorie
  const categoryTitles: Record<string, string> = {
    culture: "Art & Culture",
    bakery: "Bakery",
    pizza: "Pizza",
    transport: "Public Transport",
    wc: "Public Toilets",
    restaurant: "Restaurants",
    bar: "Bars & Cocktails",
    cocktails: "Bars & Cocktails",
    cafe: "Café",
    street_food: "Street Food",
    bike: "Bike Riding",
    luggage: "Luggage Storage",
    taxi: "Taxi & Private Transport",
    atm: "ATM",
    boat: "Boat Rental",
    attractions: "Attractions",
    nightlife: "Night Life",
    shop: "Shopping",
    shopping: "Shopping",
    luxury: "Luxury Shopping",
    shopping_hq: "Luxury Shopping",
    gym: "Gym",
    parking: "Parking",
    free_beaches: "Free Beaches",
    private_luxury: "Private & Luxury",
    refuge: "Mountain Refuge",
    villa: "Villa",
    stroll: "Strolls",
    lidi: "Beach Resorts",
    beach: "Beach Resorts",
    secret: "Secret Places",
    adventure: "Adventure",
    gelato: "Gelato",
    daytrips: "Day Trips",
    grocery: "Grocery"
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

      {/* Corpo: filtri categorie sopra + mappa */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl pt-4">
          {/* Barra categorie orizzontale scorrevole */}
          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <div className="inline-flex gap-1 min-w-full p-1.5 bg-white rounded-lg border">
              <button 
                onClick={() => setSelectedCategories([])}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap flex-shrink-0
                  ${selectedCategories.length === 0 
                    ? "bg-blue-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {t('categories.all')}
              </button>
              {categories.map(c => (
                <button 
                  key={c} 
                  onClick={() => toggleCategory(c)}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap flex-shrink-0
                    ${selectedCategories.includes(c)
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  <CategoryBadge category={c} />
                  <span>{categoryTitles[c] || c}</span>
                  <span className={`text-[9px] px-1 rounded ${selectedCategories.includes(c) ? 'bg-white/20' : 'bg-white'}`}>
                    {all.filter(p => normalizeCategory(p.category) === c).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mappa */}
          <div>
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
        </div>
      </section>

      {/* I tuoi luoghi preferiti */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-semibold text-blue-600">My favorites</h2>
              <span className="text-sm text-gray-500">({favorites.length})</span>
            </div>
            
            {favoritesList.length > 0 && (
              <button
                onClick={() => {
                  if (favoritesList.length === 1) {
                    // Se c'è solo un luogo, apri la ricerca
                    const p = favoritesList[0];
                    const url = `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
                    window.open(url, '_blank');
                  } else {
                    // Limita a massimo 9 waypoints (limite di Google Maps)
                    const maxPlaces = Math.min(favoritesList.length, 10); // 1 origin + 8 waypoints + 1 destination = 10
                    const limitedList = favoritesList.slice(0, maxPlaces);
                    
                    const origin = limitedList[0];
                    const destination = limitedList[limitedList.length - 1];
                    
                    // Waypoints intermedi (escludi origin e destination)
                    const waypoints = limitedList.slice(1, -1)
                      .map(p => `${p.lat},${p.lng}`)
                      .join('|');
                    
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}${waypoints ? `&waypoints=${waypoints}` : ''}`;
                    window.open(url, '_blank');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                Apri tutti in Google Maps {favoritesList.length > 10 && `(primi 10)`}
              </button>
            )}
          </div>
          
          {favoritesList.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">{t('virtualExploration.noFavorites')}</p>
              <p className="text-sm">{t('virtualExploration.noFavoritesDescription')}</p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-white overflow-hidden">
              <div className="divide-y">
                {favoritesList.map(p => (
                  <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {p.image && (
                        <img 
                          src={p.image} 
                          alt={p.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {p.city}{p.country ? `, ${p.country}` : ''}
                            </p>
                            {p.address && (
                              <p className="text-xs text-gray-500 mb-2">📍 {p.address}</p>
                            )}
                          </div>
                          
                          <button
                            onClick={() => toggleFavorite(p.id)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            title={t('virtualExploration.removeFromFavorites')}
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`/luogo/${p.slug}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                          >
                            Pagina luogo
                          </a>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' ' + (p.address || p.city || ''))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-black/90 transition-colors text-xs font-medium"
                          >
                            <MapPin className="w-3 h-3" />
                            Maps
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}