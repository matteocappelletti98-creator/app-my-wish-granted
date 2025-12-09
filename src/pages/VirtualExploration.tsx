import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

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
    'restaurant',
    'culture',
    'shopping',
    'attractions',
    'info',
    'taxi',
    'boat',
    'cafe',
    'villa',
    'adventure',
    'transport',
    'lidi',
    'bar',
    'cinema',
    'stroll',
    'wc',
    'free_beaches',
    'secret',
    'gelato',
    'refuge',
    'luggage',
    'rent',
    'bakery',
    'local',
    'parking',
    'private_luxury',
    'pizza',
    'gym',
    'pub',
    'nightlife',
    'late_night',
    'wine_bar',
    'gastronomy'
  ];

  const categories = useMemo(() => {
    return allCategories;
  }, []);

  // Stato per filtro Traveller Path
  const [tpFilterActive, setTpFilterActive] = useState(false);

  const filtered = useMemo(() => {
    const needle = search.toLowerCase();
    return all.filter(p => {
      const t = `${p.name} ${p.city} ${p.description}`.toLowerCase();
      const okText = !needle || t.includes(needle);
      
      // Se filtro Traveller Path attivo
      if (tpFilterActive) {
        if (!userTravellerCodes.length || !p.tp_codes?.length) return false;
        const hasMatch = p.tp_codes.some(code => userTravellerCodes.includes(code));
        return okText && hasMatch;
      }
      
      const okCat = selectedCategories.length === 0 || selectedCategories.some(cat => normalizeCategory(p.category) === cat);
      return okText && okCat;
    });
  }, [all, search, selectedCategories, tpFilterActive, userTravellerCodes]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Mapping dei titoli delle categorie
  const categoryTitles: Record<string, string> = {
    restaurant: "Ristoranti",
    culture: "Art and Culture",
    shopping: "Shopping",
    attractions: "Attractions",
    info: "Info Point",
    taxi: "Taxi",
    boat: "Boat Rental",
    cafe: "Cafè",
    villa: "Villa",
    adventure: "Adventure",
    transport: "Public Transport",
    lidi: "Lidi",
    bar: "Bar and Cocktail's",
    cinema: "Cinemas & Bookstores",
    stroll: "Stroll",
    wc: "WC",
    free_beaches: "Free Beaches",
    secret: "Secret Places",
    gelato: "Gelato",
    refuge: "Mountain Refuge",
    luggage: "Luggage Storage",
    rent: "Rent a Ride",
    bakery: "Bakery and Pastry",
    local: "Local Life",
    parking: "Parking",
    private_luxury: "Private and Luxury",
    pizza: "Pizzerie",
    gym: "Gym",
    pub: "Pub",
    nightlife: "Night Life",
    late_night: "Late Night Eats",
    wine_bar: "Wine Bar",
    gastronomy: "Gastronomie"
  };

  // Filtra solo i luoghi preferiti per la lista
  const favoritesList = useMemo(() => {
    return all.filter(p => favorites.includes(p.id));
  }, [all, favorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* Filtri categorie in alto - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="px-4 py-3 overflow-x-auto scrollbar-hide touch-pan-x">
          <div className="inline-flex gap-1 min-w-full">
            {/* Traveller Path - Prima posizione con glow */}
            {userTravellerCodes.length > 0 && (
              <button
                onClick={() => {
                  setTpFilterActive(!tpFilterActive);
                  if (!tpFilterActive) setSelectedCategories([]);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap flex-shrink-0 border-2
                  ${tpFilterActive 
                    ? "bg-sunset-orange text-white border-sunset-orange shadow-[0_0_12px_hsl(var(--sunset-orange)/0.6)]" 
                    : "bg-white text-sunset-orange border-sunset-orange shadow-[0_0_8px_hsl(var(--sunset-orange)/0.4)] animate-pulse"}`}
              >
                <span>🧭</span>
                <span>Traveller Path</span>
              </button>
            )}
            
            <button
              onClick={() => { setSelectedCategories([]); setTpFilterActive(false); }}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0
                ${selectedCategories.length === 0 && !tpFilterActive
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              {t('categories.all')}
            </button>
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => { toggleCategory(c); setTpFilterActive(false); }}
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0
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
      </div>

      {/* Mappa - Occupa la viewport disponibile */}
      <div className="relative" style={{ height: 'calc(100vh - 8rem)' }}>
        {loading ? (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
            <div className="text-gray-500">Caricamento...</div>
          </div>
        ) : (
          <MapView
            places={all.filter(p => p.status === "published")} 
            selectedCategories={selectedCategories} 
            className="absolute inset-0 w-full h-full"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            userTravellerCodes={userTravellerCodes}
          />
        )}
      </div>
    </div>
  );
}