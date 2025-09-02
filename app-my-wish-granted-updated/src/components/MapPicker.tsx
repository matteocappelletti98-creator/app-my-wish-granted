import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import { GOOGLE_FORM } from "@/config";

type Props = {
  className?: string;
  context?: "home" | "my"; // to optionally tag the form with a source
  onPick?: (lat:number, lng:number) => void;
};

function buildPrefillUrl(lat:number, lng:number, ctx:Props["context"]){
  const base = GOOGLE_FORM.baseUrl;
  const e = GOOGLE_FORM.entries || {};
  const qs: string[] = [];
  if (e.lat && !e.lat.includes("LAT_ID")) qs.push(`${encodeURIComponent(e.lat)}=${encodeURIComponent(lat)}`);
  if (e.lng && !e.lng.includes("LNG_ID")) qs.push(`${encodeURIComponent(e.lng)}=${encodeURIComponent(lng)}`);
  if (ctx && e.source && !e.source.includes("SOURCE_ID")) qs.push(`${encodeURIComponent(e.source)}=${encodeURIComponent(ctx)}`);
  const url = qs.length ? `${base}?usp=pp_url&${qs.join("&")}` : base;
  return url;
}

export default function MapPicker({ className, context="home", onPick }: Props){
  const containerRef = useRef<HTMLDivElement|null>(null);
  const mapRef = useRef<LeafletMap|null>(null);
  const markerRef = useRef<L.Marker|null>(null);
  const [coords, setCoords] = useState<{lat:number, lng:number} | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current).setView([41.9028, 12.4964], 5); // Italy default view

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    const clickHandler = (e: any) => {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
      if (markerRef.current) markerRef.current.remove();
      const icon = L.divIcon({
        html: `<div style="width:34px;height:34px;border-radius:999px;background:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #1E66F5;box-shadow:0 1px 4px rgba(0,0,0,.25)">📍</div>`,
        className: ""
      });
      markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current!);
      onPick?.(lat, lng);
    };
    mapRef.current.on("click", clickHandler);
    return () => { mapRef.current?.off("click", clickHandler); mapRef.current?.remove(); mapRef.current=null; };
  }, [onPick]);

  const prefillUrl = coords ? buildPrefillUrl(coords.lat, coords.lng, context) : undefined;

  return (
    <div className={className}>
      <div ref={containerRef} className="w-full h-[50vh] rounded-2xl border" />
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {coords ? (
          <>
            <span className="px-2 py-1 rounded bg-gray-100">Lat: <b>{coords.lat.toFixed(6)}</b></span>
            <span className="px-2 py-1 rounded bg-gray-100">Lng: <b>{coords.lng.toFixed(6)}</b></span>
            <button
              onClick={() => { if (prefillUrl) window.open(prefillUrl, "_blank"); }}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Apri questionario
            </button>
            <button
              onClick={async () => { try { await navigator.clipboard.writeText(`${coords.lat}, ${coords.lng}`);} catch {} }}
              className="px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              Copia coordinate
            </button>
          </>
        ) : (
          <span className="text-gray-600">Clicca sulla mappa per scegliere il punto e ottenere le coordinate.</span>
        )}
      </div>
    </div>
  );
}
