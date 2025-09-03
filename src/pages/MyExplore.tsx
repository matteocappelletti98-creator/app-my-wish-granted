import React, { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link, useNavigate } from "react-router-dom";
import { MY_CSV_URL } from "@/config";
import { useCityStatus } from "@/hooks/useCityStatus";
import { CITIES } from "@/types/city";

export default function MyExplore() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string|undefined>(undefined);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showVisited, setShowVisited] = useState(false);
  const nav = useNavigate();
  const { getWishlistCities, getVisitedCities } = useCityStatus();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlacesFromSheet(MY_CSV_URL);
        setAll(data.filter(p => p.status === "published"));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cities = useMemo(() => Array.from(new Set(all.map(p => p.city).filter(Boolean))).sort(), [all]);
  const categories = useMemo(() => Array.from(new Set(all.map(p => normalizeCategory(p.category)).filter(Boolean))).sort(), [all]);
  const filtered = useMemo(() => all.filter(p => !cat || normalizeCategory(p.category) === cat), [all, cat]);

  return (
    <div className="space-y-6">
      <header className="px-6 pt-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">my.explore</h1>
                <p className="text-sm text-gray-600">Traveler Explorer</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/add-place?context=my" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">+ Inserisci POI</Link>
              {getWishlistCities().length > 0 && (
                <button 
                  onClick={() => setShowWishlist(!showWishlist)}
                  className="px-3 py-2 rounded-md border bg-green-50 border-green-200 hover:bg-green-100"
                >
                  💚 Lista dei desideri ({getWishlistCities().length})
                </button>
              )}
              {getVisitedCities().length > 0 && (
                <button 
                  onClick={() => setShowVisited(!showVisited)}
                  className="px-3 py-2 rounded-md border bg-purple-50 border-purple-200 hover:bg-purple-100"
                >
                  🏁 Il mio viaggio ({getVisitedCities().length})
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{getWishlistCities().length} città in wishlist</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>{getVisitedCities().length} città visitate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>{all.length} POI aggiunti</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2 pb-4">Mappa privata/moderata con le tue aggiunte. Clicca su una categoria per filtrare, oppure seleziona un marker per aprire la pagina del POI.</p>
        </div>
      </header>

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
                onMarkerClick={(p) => nav(`/poi/${p.slug}?ctx=my`)}
              />
            )}
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🗂️</span>
                <h2 className="font-semibold text-blue-700">Categorie</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>setCat(undefined)} className={"px-2.5 py-1 rounded-full border "+(!cat?"bg-blue-50 border-blue-200":"")}>Tutte</button>
                {categories.map(c => (
                  <button key={c} onClick={()=>setCat(c)} className={"px-2.5 py-1 rounded-full border "+(cat===c?"bg-blue-50 border-blue-200":"")}>
                    <CategoryBadge category={c} />
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📍</span>
                  <h3 className="font-medium">I tuoi luoghi</h3>
                </div>
                <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
                  {filtered.map(p => (
                    <Link key={p.id} to={`/poi/${p.slug}?ctx=my`} className="block rounded-md border p-2 hover:bg-gray-50">
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-gray-600">{p.city} • {p.country}</div>
                    </Link>
                  ))}
                  {filtered.length === 0 && <div className="text-gray-600 text-sm">Nessun POI trovato.</div>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Overlay Wishlist */}
      {showWishlist && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute right-4 top-4">
            <button onClick={() => setShowWishlist(false)} className="rounded-xl border border-green-600 text-green-600 px-3 py-2">✖ Chiudi</button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4">💚 Lista dei desideri</h2>
            <MapView 
              places={all.filter(p => getWishlistCities().some(cityId => {
                const city = Object.values(CITIES).find(c => c.id === cityId);
                return city && p.city?.toLowerCase().includes(city.name.toLowerCase());
              }))} 
              className="h-full w-full" 
              showCityCircles={true}
            />
          </div>
        </div>
      )}

      {/* Overlay Visited */}
      {showVisited && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="absolute right-4 top-4">
            <button onClick={() => setShowVisited(false)} className="rounded-xl border border-purple-600 text-purple-600 px-3 py-2">✖ Chiudi</button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">🏁 Il mio viaggio</h2>
            <MapView 
              places={all.filter(p => getVisitedCities().some(cityId => {
                const city = Object.values(CITIES).find(c => c.id === cityId);
                return city && p.city?.toLowerCase().includes(city.name.toLowerCase());
              }))} 
              className="h-full w-full" 
              showCityCircles={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}