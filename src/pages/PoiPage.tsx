import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { HOME_CSV_URL, MY_CSV_URL } from "@/config";
import MapView from "@/components/MapView";

type Article = { id:string; title:string; content:string; img?:string; poiSlug?:string; createdAt:number };

function loadArticles(): Article[] {
  try { return JSON.parse(localStorage.getItem("blog_articles") || "[]"); } catch { return []; }
}

export default function PoiPage(){
  const { slug } = useParams();
  const [params] = useSearchParams();
  const ctx = params.get("ctx") === "my" ? "my" : "home";
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const url = ctx === "my" ? MY_CSV_URL : HOME_CSV_URL;
        const list = await fetchPlacesFromSheet(url);
        const p = list.find(x => x.slug === slug);
        setPlace(p || null);
      } finally { setLoading(false); }
    })();
  }, [slug, ctx]);

  const linkedArticles = useMemo(() => {
    const all = loadArticles();
    return all.filter(a => a.poiSlug === slug).sort((a,b)=>b.createdAt-a.createdAt);
  }, [slug]);

  if (loading) return <div className="p-6">Carico…</div>;
  if (!place) return <div className="p-6">POI non trovato.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">{place.name}</h1>
          <div className="text-gray-600">{place.city} • {place.country}</div>
        </div>
        <Link to={`/blog?link=${place.slug}`} className="px-3 py-2 rounded-md border hover:bg-gray-50">Collega articolo a questo POI</Link>
      </div>

      {place.lat && place.lng && (
        <MapView places={[place]} className="h-[40vh] w-full rounded-2xl border" />
      )}

      {place.image && <img src={place.image} alt={place.name} className="rounded-lg border" />}

      <div>
        <h2 className="font-semibold mb-2">Descrizione</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{place.description || "—"}</p>
      </div>

      {ctx==="my" && (<div>
        <h2 className="font-semibold mb-2">Articoli collegati</h2>
        {linkedArticles.length === 0 ? (
          <p className="text-gray-600">Nessun articolo collegato. <Link to={`/blog?link=${place.slug}`} className="underline text-blue-600">Crea e collega</Link>.</p>
        ) : (
          <div className="space-y-3">
            {linkedArticles.map(a => (
              <div key={a.id} className="rounded-lg border p-3">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
                {a.img && <img src={a.img} alt="" className="mt-2 rounded-md border max-h-64 object-cover" />}
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{a.content}</p>
                <Link to={`/blog?edit=${a.id}`} className="inline-block mt-2 text-blue-600 underline">Modifica</Link>
              </div>
            ))}
          </div>
        )}
      </div>)}
    </div>
  );
}