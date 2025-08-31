// src/pages/Index.tsx
import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import PlaceCard, { PlaceCardSkeleton } from "@/components/PlaceCard";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Link } from "react-router-dom";

// Tuo CSV pubblicato (lo abbiamo già usato prima)
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Index() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState<string>(""); // filtro categoria sulla home

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
    const set = new Set(
      all.map(p => normalizeCategory(p.category)).filter(Boolean)
    );
    return Array.from(set) as string[];
  }, [all]);

  // Mostra gli ultimi 9 (filtrati per categoria se selezionata)
  const latest = useMemo(() => {
    const sorted = [...all]; // in assenza di timestamp, usiamo l'ordine del foglio
    const sliced = sorted.slice(-9).reverse();
    return cat ? sliced.filter(p => normalizeCategory(p.category) === normalizeCategory(cat)) : sliced;
  }, [all, cat]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* HERO */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl py-10 md:py-14">
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-8 md:p-12 shadow-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Scopri e condividi luoghi speciali
            </h1>
            <p className="mt-3 md:mt-4 text-white/90 md:text-lg">
              Aggiungi i tuoi posti preferiti e trova ispirazione vicino a te. La community cresce con te.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/add-place"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2 font-medium text-blue-700 shadow hover:bg-white/90"
              >
                + Inserisci un luogo
              </Link>
              <Link
                to="/places"
                className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2 font-medium text-white ring-1 ring-white/40 hover:bg-white/20"
              >
                Esplora tutti i luoghi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIE */}
      <section className="px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Categorie</h2>
            {cat && (
              <button
                onClick={() => setCat("")}
                className="text-sm text-blue-700 underline"
              >
                Pulisci filtro
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {!categories.length && (
              <span className="text-gray-500 text-sm">
                Nessuna categoria ancora: aggiungi luoghi dal modulo.
              </span>
            )}
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c === cat ? "" : c)}
                className={`rounded-full border px-3 py-1.5 text-sm transition
                  ${c === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-slate-50"}
                `}
              >
                <CategoryBadge category={c} showLabel />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ULTIMI LUOGHI */}
      <section className="px-6 mt-8 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">
              {cat ? `Ultimi in “${cat}”` : "Ultimi luoghi pubblicati"}
            </h2>
            <Link to="/places" className="text-blue-700 text-sm underline">
              Vedi tutti →
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
            </div>
          ) : latest.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-600">
              Nessun luogo pubblicato{cat ? " in questa categoria" : ""}…  
              <div className="mt-3">
                <Link to="/add-place" className="text-blue-700 underline">
                  Aggiungi il primo →
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p, i) => <PlaceCard key={i} p={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}