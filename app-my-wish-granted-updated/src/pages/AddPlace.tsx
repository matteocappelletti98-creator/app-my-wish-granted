import { useMemo, useState } from "react";
import { GOOGLE_FORM } from "@/config";
import MapPicker from "@/components/MapPicker";
import { useSearchParams } from "react-router-dom";

function buildEmbeddedUrl(prefillUrl: string){
  if (!GOOGLE_FORM.embedded) return prefillUrl;
  // transform .../viewform to .../viewform?embedded=true and keep qs
  const [base, qs=""] = prefillUrl.split("?");
  const glue = qs ? `?${qs}&embedded=true` : "?embedded=true";
  return `${base}${glue}`;
}

export default function AddPlace(){
  const [coords, setCoords] = useState<{lat:number,lng:number}|null>(null);
  const [params] = useSearchParams();
  const ctx = (params.get("context") === "my") ? "my" : "home";

  const prefilled = useMemo(() => {
    const base = GOOGLE_FORM.baseUrl;
    const e = GOOGLE_FORM.entries || {};
    const qs: string[] = [];
    if (coords) {
      if (e.lat && !e.lat.includes("LAT_ID")) qs.push(`${encodeURIComponent(e.lat)}=${encodeURIComponent(coords.lat)}`);
      if (e.lng && !e.lng.includes("LNG_ID")) qs.push(`${encodeURIComponent(e.lng)}=${encodeURIComponent(coords.lng)}`);
    }
    if (ctx === "my" && e.source && !e.source.includes("SOURCE_ID")) qs.push(`${encodeURIComponent(e.source)}=my_explore`);
    const url = qs.length ? `${base}?usp=pp_url&${qs.join("&")}` : base;
    return buildEmbeddedUrl(url);
  }, [coords, ctx]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-blue-700">Inserisci un nuovo POI</h1>
      <p className="text-gray-600">
        1) Clicca sulla mappa per scegliere il punto. 2) Apri/compila il questionario: le coordinate saranno già precompilate (se hai configurato gli <code>entry</code> in <code>src/config.ts</code>).
      </p>

      <MapPicker context={ctx as any} onPick={(lat,lng)=>setCoords({lat,lng})} />

      <div className="border rounded-lg overflow-hidden">
        <iframe src={prefilled} width="100%" height="1200" style={{ border: 0 }} title="Form Inserimento Luogo" />
      </div>
      <a href={prefilled.replace("&embedded=true","")} target="_blank" rel="noreferrer" className="inline-block mt-2 text-blue-600 underline">
        Apri il modulo in una nuova scheda
      </a>
    </div>
  );
}
