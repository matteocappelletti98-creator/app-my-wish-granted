import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link, useNavigate } from "react-router-dom";
import { MY_CSV_URL } from "@/config";

export default function MyExplore() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string|undefined>(undefined);
  const nav = useNavigate();

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
      <header className="px-6 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-blue-700">my.explore</h1>
            <div className="flex items-center gap-3">
              <Link to="/add-place?context=my" className="px-3 py-2 rounded-md border hover:bg-gray-50">+ Inserisci POI</Link>
            </div>
          </div>
          <p className="text-gray-600">Mappa privata/moderata con le tue aggiunte. Clicca su una categoria per filtrare, oppure seleziona un marker per aprire la pagina del POI.</p>
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
            <div className="rounded-2xl border p-4 bg-white">
              <h2 className="font-semibold mb-3 text-blue-700">Categorie</h2>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>setCat(undefined)} className={"px-2.5 py-1 rounded-full border "+(!cat?"bg-blue-50 border-blue-200":"")}>Tutte</button>
                {categories.map(c => (
                  <button key={c} onClick={()=>setCat(c)} className={"px-2.5 py-1 rounded-full border "+(cat===c?"bg-blue-50 border-blue-200":"")}>
                    <CategoryBadge category={c} />
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-medium mb-2">Elenco</h3>
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
    </div>
  );
}
