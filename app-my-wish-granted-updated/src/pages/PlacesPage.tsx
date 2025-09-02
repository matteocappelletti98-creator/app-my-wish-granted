import { useEffect, useMemo, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { HOME_CSV_URL } from "@/config";

const CSV_URL = HOME_CSV_URL;

export default function PlacesPage() {
  const [all, setAll] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(""); const [city, setCity] = useState("");

  useEffect(() => { (async () => {
    try { const data = await fetchPlacesFromSheet(CSV_URL); setAll(data.filter(p => p.status === "published")); }
    finally { setLoading(false); }
  })(); }, []);

  const cities = useMemo(() => Array.from(new Set(all.map(p => p.city).filter(Boolean))).sort(), [all]);
  const list = useMemo(() => {
    const needle = q.toLowerCase();
    return all.filter(p => {
      const t = (p.name+p.city+p.description).toLowerCase();
      return (!city || p.city === city) && t.includes(needle);
    });
  }, [all, q, city]);

  if (loading) return <div className="p-6">Caricamento…</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Luoghi pubblicati</h1>
      <div className="flex gap-2">
        <input className="border p-2 rounded w-full" placeholder="Cerca…" value={q} onChange={(e)=>setQ(e.target.value)} />
        <select className="border p-2 rounded" value={city} onChange={(e)=>setCity(e.target.value)}>
          <option value="">Tutte le città</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {list.length === 0 && <div className="text-gray-500">Nessun luogo trovato.</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((p, i) => (
          <div key={i} className="rounded-xl border p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <span className="text-sm text-gray-500">{p.city}{p.city && p.country ? ", " : ""}{p.country}</span>
            </div>
            {p.image && <img className="w-full rounded-lg" src={p.image} alt={p.name} />}
            <p className="text-gray-700">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}