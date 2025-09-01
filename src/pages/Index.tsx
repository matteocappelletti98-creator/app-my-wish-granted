
import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import PlaceCard from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link } from "react-router-dom";

// Tuo CSV pubblicato
const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Index() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>("");
  const [overlay, setOverlay] = useState(false); // fullscreen overlay

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header stile home */}
      <header className="px-6 py-4 border-b bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <span className="text-blue-600">📍</span> <span>explore</span>
            </div>
            <div className="text-sm text-blue-900/70">Independent local guide</div>
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
              <MapView places={filtered} selectedCategory={cat} className="h-[70vh] w-full rounded-2xl border" />
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

      {/* Ricerca + Lista */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl mt-6">
          <h2 className="text-xl font-semibold mb-3">Luoghi pubblicati</h2>
          <div className="flex gap-2 mb-4">
            <input
              className="border rounded-xl px-3 py-2 w-full"
              placeholder="Cerca per nome, città, descrizione…"
              value={search}
              onChange={e=>setSearch(e.target.value)}
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              Nessun luogo trovato {cat ? `in "${cat}"` : ""}.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(p => <PlaceCard key={p.id} place={p} />)}
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
          <MapView places={filtered} selectedCategory={cat} className="h-full w-full" />
        </div>
      )}
    </div>
  ); 
  // Dove renderizzi la lista:
  <div className="absolute left-3 top-3">
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();           // evita click sulla card
      onCategoryClick?.(p.category); // comunica al genitore
    }}
    aria-label={`Vedi categoria ${p.category ?? "tutte"}`}
    className="rounded-full shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    title="Filtra per categoria"
  >
    <CategoryBadge category={p.category} />
  </button>
</div>
}
