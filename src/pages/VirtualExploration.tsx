import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

// Tuo CSV pubblicato
const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function VirtualExploration() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("");
  const [overlay, setOverlay] = useState(false); // fullscreen overlay
  const [favorites, setFavorites] = useState<string[]>([]);

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
      const okCat = !cat || normalizeCategory(p.category) === normalizeCategory(cat);
      return okText && okCat;
    });
  }, [all, search, cat]);

  // Filtra solo i luoghi preferiti per la lista
  const favoritesList = useMemo(() => {
    return all.filter(p => favorites.includes(p.id));
  }, [all, favorites]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header stile home */}
      <header className="px-6 py-4 border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="text-blue-600">📍</span> <span>Virtual Exploration</span>
            </div>
            <div className="text-sm text-blue-900/70">Esplora i luoghi sulla mappa e salva i tuoi preferiti</div>
          </div>
          <div className="flex gap-3">
            <Link to="/add-place" className="rounded-xl bg-blue-600 text-white px-3 py-2">+ Aggiungi luogo</Link>
            <button onClick={()=>setOverlay(true)} className="rounded-xl border border-blue-600 text-blue-600 px-3 py-2">🗖 Ingrandisci</button>
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
                places={filtered} 
                selectedCategory={cat} 
                className="h-[70vh] w-full rounded-2xl border"
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border p-4 bg-white">
              <h3 className="font-semibold mb-2">Categorie</h3>
              <div className="flex flex-col gap-2">
                <button onClick={()=>setCat("")}
                  className={`text-left rounded-xl px-3 py-2 border ${cat==="" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
                  Tutte
                </button>
                {categories.map(c => (
                  <button key={c} onClick={()=> setCat(c===cat?"":c)}
                    className={`text-left rounded-xl px-3 py-2 border flex items-center gap-2
                    ${c===cat ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}`}>
                    <CategoryBadge category={c} />
                    <span className="text-sm">{c}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* I tuoi luoghi preferiti */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-semibold">I tuoi luoghi preferiti</h2>
            <span className="text-sm text-gray-500">({favorites.length})</span>
          </div>
          
          {favoritesList.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nessun luogo preferito</p>
              <p className="text-sm">Clicca sul cuore sulla mappa per aggiungere luoghi ai tuoi preferiti</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favoritesList.map(p => (
                <div key={p.id} className="relative">
                  <PlaceCard place={p} />
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Overlay fullscreen mappa */}
      {overlay && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute right-4 top-4 flex gap-2">
            <Link to="/add-place" className="rounded-xl bg-blue-600 text-white px-3 py-2">+ Aggiungi luogo</Link>
            <button onClick={()=>setOverlay(false)} className="rounded-xl border border-blue-600 text-blue-600 px-3 py-2">✖ Chiudi</button>
          </div>
          {/* riuso gli stessi dati/filtri correnti */}
          <MapView 
            places={filtered} 
            selectedCategory={cat} 
            className="h-full w-full"
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      )}
    </div>
  );
}