import React, { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { MapSection } from "@/components/sections/MapSection";
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
            <h1 className="text-2xl font-bold text-primary">my.explore</h1>
            <div className="flex items-center gap-3">
              <Link to="/add-place?context=my" className="px-3 py-2 rounded-md border hover:bg-muted">+ Inserisci POI</Link>
            </div>
          </div>
          <p className="text-muted-foreground">Mappa privata/moderata con le tue aggiunte. Clicca su una categoria per filtrare, oppure seleziona un marker per aprire la pagina del POI.</p>
        </div>
      </header>

      {/* Map Section con design brand */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <MapSection />
        </div>
      </section>

      {/* Categories and Places */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-2xl border p-4 bg-card">
            <h2 className="font-semibold mb-3 text-primary">Categorie</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setCat(undefined)} className={"px-2.5 py-1 rounded-full border "+(!cat?"bg-secondary text-secondary-foreground":"hover:bg-muted")}>Tutte</button>
              {categories.map(c => (
                <button key={c} onClick={()=>setCat(c)} className={"px-2.5 py-1 rounded-full border "+(cat===c?"bg-secondary text-secondary-foreground":"hover:bg-muted")}>
                  <CategoryBadge category={c} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Luoghi</h3>
            {loading ? (
              <div className="text-muted-foreground">Caricamento...</div>
            ) : filtered.length === 0 ? (
              <div className="text-muted-foreground">Nessun POI trovato.</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(p => (
                  <div key={p.id} onClick={() => nav(`/poi/${p.slug}?ctx=my`)} className="cursor-pointer">
                    <PlaceCard place={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}