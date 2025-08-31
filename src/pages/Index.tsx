import { useEffect, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import CategoryIcon, { normalizeCategory } from "@/components/CategoryIcon";
import { Link } from "react-router-dom";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Index() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchPlacesFromSheet(CSV_URL);
        const published = data.filter(p => p.status === "published");
        // ultimi 6 pubblicati (più recenti in alto)
        setPlaces(published.slice(-6).reverse());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Caricamento…</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Esplora luoghi</h1>
        <p className="text-gray-600">Gli ultimi luoghi pubblicati dalla community.</p>
      </header>

      {places.length === 0 && (
        <div className="text-gray-500">Ancora nessun luogo pubblicato.</div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {places.map((p, i) => (
          <article key={i} className="rounded-2xl border p-4 shadow-sm bg-white space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gray-100">
                <CategoryIcon category={p.category} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500">
                  {p.city}{p.city && p.country ? ", " : ""}{p.country}
                </p>
                <p className="text-xs text-gray-500">
                  Categoria: {normalizeCategory(p.category) }
                </p>
              </div>
            </div>

            {p.image && (
              <img src={p.image} alt={p.name} className="w-full rounded-xl" />
            )}

            <p className="text-gray-700 line-clamp-3">{p.description}</p>
          </article>
        ))}
      </div>

      <div className="pt-2">
        <Link to="/places" className="text-blue-600 underline">
          Vedi tutti i luoghi →
        </Link>
      </div>
    </div>
  );
}