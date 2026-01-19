import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, User, Lightbulb, ChevronDown, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { SuggestPlaceDialog } from "@/components/SuggestPlaceDialog";
import { useCities, City } from "@/hooks/useCities";

// Tuo CSV pubblicato
const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function VirtualExploration() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [overlay, setOverlay] = useState(false); // fullscreen overlay
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userTravellerCodes, setUserTravellerCodes] = useState<number[]>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // Hook per gestire le città
  const { cities, activeCities, selectedCity, selectCity, deselectCity, isPlaceInSelectedCity, loading: citiesLoading } = useCities();

  // Auth listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Carica preferiti (database se loggato, altrimenti localStorage)
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // Carica dal database
        const { data, error } = await supabase
          .from("user_favorites")
          .select("place_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading favorites:", error);
        } else {
          setFavorites(data.map(f => f.place_id));
        }
      } else {
        // Carica da localStorage
        const saved = localStorage.getItem('explore-favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
    };

    loadFavorites();
  }, [user]);

  // Salva preferiti (database se loggato, altrimenti localStorage)
  const saveFavorites = async (newFavorites: string[]) => {
    setFavorites(newFavorites);
    
    if (user) {
      // Non usiamo direttamente saveFavorites per il database
      // La logica è gestita in toggleFavorite
    } else {
      localStorage.setItem('explore-favorites', JSON.stringify(newFavorites));
    }
  };

  const toggleFavorite = async (placeId: string) => {
    if (!user) {
      // Non loggato: usa localStorage
      const newFavorites = favorites.includes(placeId)
        ? favorites.filter(id => id !== placeId)
        : [...favorites, placeId];
      setFavorites(newFavorites);
      localStorage.setItem('explore-favorites', JSON.stringify(newFavorites));
      return;
    }

    // Loggato: usa database
    const isCurrentlyFavorite = favorites.includes(placeId);
    
    if (isCurrentlyFavorite) {
      // Rimuovi dai preferiti
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", placeId);

      if (error) {
        console.error("Error removing favorite:", error);
      } else {
        setFavorites(favorites.filter(id => id !== placeId));
      }
    } else {
      // Aggiungi ai preferiti
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, place_id: placeId });

      if (error) {
        console.error("Error adding favorite:", error);
      } else {
        setFavorites([...favorites, placeId]);
      }
    }
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

  // Tutte le categorie da visualizzare, anche se vuote
  const allCategories = [
    'culture',
    'bakery',
    'pizza',
    'transport',
    'wc',
    'restaurant',
    'cocktails',
    'cafe',
    'bike',
    'luggage',
    'taxi',
    'atm',
    'boat',
    'rent_a_ride',
    'attractions',
    'nightlife',
    'shop',
    'gym',
    'parking',
    'free_beaches',
    'luxury',
    'refuge',
    'villa',
    'stroll',
    'lidi',
    'secret',
    'adventure',
    'gelato',
    'grocery',
    'local_life',
    'late_night_eats',
    'relax',
    'cinema_books'
  ];

  const categories = useMemo(() => {
    return allCategories;
  }, []);

  // Stato per filtri speciali
  const [tpFilterActive, setTpFilterActive] = useState(false);
  const [favoritesFilterActive, setFavoritesFilterActive] = useState(false);
  const [suggestDialogOpen, setSuggestDialogOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return all.filter(p => {
      const t = `${p.name} ${p.city} ${p.description}`.toLowerCase();
      const okText = !needle || t.includes(needle);
      
      // Filtro categoria (se selezionate)
      const okCat = selectedCategories.length === 0 || selectedCategories.some(cat => normalizeCategory(p.category) === cat);
      
      // Filtro Preferiti (Mymap)
      const okFavorites = !favoritesFilterActive || favorites.includes(p.id);
      
      // Filtro Traveller Path (combinabile con categorie)
      let okTp = true;
      if (tpFilterActive) {
        if (!userTravellerCodes.length || !p.tp_codes?.length) {
          okTp = false;
        } else {
          okTp = p.tp_codes.some(code => userTravellerCodes.includes(code));
        }
      }
      
      // Filtro città (Big POI City) - mostra solo POI della città selezionata
      const okCity = isPlaceInSelectedCity(p.city || '');
      
      return okText && okCat && okFavorites && okTp && okCity;
    });
  }, [all, search, selectedCategories, tpFilterActive, favoritesFilterActive, favorites, userTravellerCodes, isPlaceInSelectedCity]);

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
    bakery: "Bakery and Pastry",
    pizza: "Pizza",
    transport: "Public Transport",
    wc: "Public Toilets",
    restaurant: "Restaurants",
    cocktails: "Bars & Cocktails",
    cafe: "Café",
    bike: "Bike Riding",
    luggage: "Luggage Storage",
    taxi: "Taxi & Private Transport",
    atm: "ATM",
    boat: "Boat Rental",
    rent_a_ride: "Rent a Ride",
    attractions: "Attractions",
    nightlife: "Night Life",
    shop: "Shopping",
    gym: "Gym",
    parking: "Parking",
    free_beaches: "Free Beaches",
    luxury: "Private & Luxury",
    refuge: "Mountain Refuge",
    villa: "Villa",
    stroll: "Strolls",
    lidi: "Beach Resorts",
    secret: "Secret Places",
    adventure: "Adventure",
    gelato: "Gelato",
    grocery: "Grocery",
    local_life: "Local Life",
    late_night_eats: "Late Night Eats",
    relax: "Relax",
    cinema_books: "Cinema and Bookstores"
  };

  // Filtra solo i luoghi preferiti per la lista
  const favoritesList = useMemo(() => {
    return all.filter(p => favorites.includes(p.id));
  }, [all, favorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* Filtri categorie in alto - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b">
        {/* Barra categorie scorrevole */}
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide touch-pan-x">
          <div className="inline-flex gap-1 min-w-full">
            <button
              onClick={() => { setSelectedCategories([]); setTpFilterActive(false); setFavoritesFilterActive(false); }}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${selectedCategories.length === 0 && !tpFilterActive && !favoritesFilterActive
                  ? "bg-[#009fe3] text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {t('categories.all')}
            </button>
            
            {/* Mymap - Categoria speciale con cuore */}
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  setFavoritesFilterActive(!favoritesFilterActive);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 border-2
                  ${favoritesFilterActive 
                    ? "bg-red-500 text-white border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" 
                    : "bg-white text-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
              >
                <Heart className="w-3 h-3" fill={favoritesFilterActive ? "white" : "currentColor"} />
                <span>Mymap</span>
                <span className={`text-[9px] px-1 rounded ${favoritesFilterActive ? 'bg-white/20' : 'bg-red-100'}`}>
                  {favorites.length}
                </span>
              </button>
            )}
            
            {/* Traveller Path - Combinabile con categorie */}
            {userTravellerCodes.length > 0 && (
              <button
                onClick={() => {
                  setTpFilterActive(!tpFilterActive);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 border-2
                  ${tpFilterActive 
                    ? "bg-[#009fe3] text-white border-[#009fe3] shadow-[0_0_12px_rgba(0,159,227,0.6)]" 
                    : "bg-white text-[#009fe3] border-[#009fe3] shadow-[0_0_8px_rgba(0,159,227,0.4)] animate-pulse"}`}
              >
                <span>🧭</span>
                <span>Traveller Path</span>
              </button>
            )}
            
            {/* Tutte le categorie scorrevoli */}
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => toggleCategory(c)}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0
                  ${selectedCategories.includes(c)
                    ? "bg-[#009fe3] text-white" 
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
        
        {/* Indicatore per tirare giù - Pull down handle */}
        <button
          onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
          className="w-full flex justify-center py-1 bg-gray-50 hover:bg-gray-100 transition-colors border-t"
        >
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Menu espanso con tutte le categorie */}
        {categoryMenuOpen && (
          <div className="bg-white border-b shadow-lg max-h-[50vh] overflow-y-auto">
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {categories.map(c => (
                  <button 
                    key={c} 
                    onClick={() => toggleCategory(c)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left
                      ${selectedCategories.includes(c)
                        ? "bg-[#009fe3] text-white" 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                  >
                    <CategoryBadge category={c} />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{categoryTitles[c] || c}</div>
                      <div className={`text-[10px] ${selectedCategories.includes(c) ? 'text-white/70' : 'text-gray-400'}`}>
                        {all.filter(p => normalizeCategory(p.category) === c).length} luoghi
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mappa - Occupa la viewport disponibile */}
      <div className="relative" style={{ height: 'calc(100vh - 8rem)' }}>
        {loading ? (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
            <div className="text-gray-500">Caricamento...</div>
          </div>
        ) : (
          <MapView
            places={tpFilterActive || favoritesFilterActive || selectedCategories.length > 0 ? filtered : all.filter(p => p.status === "published" && isPlaceInSelectedCity(p.city || ''))}
            selectedCategories={selectedCategories} 
            className="absolute inset-0 w-full h-full"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            userTravellerCodes={userTravellerCodes}
            cities={cities}
            selectedCity={selectedCity}
            onSelectCity={selectCity}
            onDeselectCity={deselectCity}
          />
        )}

        {/* Bottone Suggerisci Luogo */}
        <button
          onClick={() => setSuggestDialogOpen(true)}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 bg-[#009fe3] hover:bg-[#0088c6] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 text-sm font-medium"
        >
          <Lightbulb className="w-4 h-4" />
          Suggerisci luogo
        </button>
      </div>

      {/* Dialog Suggerisci Luogo */}
      <SuggestPlaceDialog 
        open={suggestDialogOpen} 
        onOpenChange={setSuggestDialogOpen} 
      />
    </div>
  );
}