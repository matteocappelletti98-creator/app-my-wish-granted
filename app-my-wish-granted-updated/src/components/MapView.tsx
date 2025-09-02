import React, { useEffect, useMemo, useRef } from "react";
import L, { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import { Place } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";

type Props = {
  places: Place[];
  selectedCategory?: string;
  className?: string;
  onMarkerClick?: (p: Place) => void;
};

export default function MapView({ places, selectedCategory, className, onMarkerClick }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Filtra solo published + categoria + coordinate valide
  const filtered = useMemo(() => {
    const cat = selectedCategory ? normalizeCategory(selectedCategory) : "";
    return places
      .filter(p => p.lat != null && p.lng != null)
      .filter(p => (cat ? normalizeCategory(p.category) === cat : true));
  }, [places, selectedCategory]);

  // Inizializza mappa una sola volta
  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      const map = L.map(containerRef.current, { zoomControl: true }).setView([41.9028, 12.4964], 12);
      mapRef.current = map;

      // Tile layer (Carto Positron)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
  }, []);

  // Aggiungi marker ogni volta che cambia filtered
  useEffect(() => {
    if (!mapRef.current) return;

    if (markersRef.current) {
      markersRef.current.clearLayers();
      mapRef.current.removeLayer(markersRef.current);
    }
    markersRef.current = L.layerGroup().addTo(mapRef.current);

    const bounds: [number, number][] = [];

    filtered.forEach(p => {
      const emoji = categoryEmoji(p.category);
      const icon = L.divIcon({
        html: `
          <div style="
            width:34px;height:34px;border-radius:999px;
            background:#fff; display:flex;align-items:center;justify-content:center;
            box-shadow:0 1px 4px rgba(0,0,0,.25); border:2px solid #1E66F5;
          ">
            <div style="font-size:20px;line-height:20px">${emoji}</div>
          </div>
        `,
        className: "poi-emoji-badge",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const m = L.marker([p.lat!, p.lng!], { icon });

      // 👇 Fix immagine nel popup
      m.bindPopup(`
        <div style="min-width:180px">
          <div style="font-weight:600;margin-bottom:4px">${emoji} ${escapeHtml(p.name)}</div>
          <div style="color:#555;font-size:12px">${escapeHtml(p.city)}${p.city && p.country ? ", " : ""}${escapeHtml(p.country)}</div>
          ${p.image ? `<img src="${p.image}" alt="immagine" width="200" style="display:block;border-radius:8px;margin-top:6px"/>` : ""}
        </div>
      `);

      if (onMarkerClick) m.on("click", () => onMarkerClick(p));
      m.addTo(markersRef.current!);
      bounds.push([p.lat!, p.lng!]);
    });

    // fit-to-bounds
    if (bounds.length >= 2) {
      mapRef.current.fitBounds(bounds as LatLngBoundsExpression, { padding: [32, 32] });
    } else if (bounds.length === 1) {
      mapRef.current.setView(bounds[0] as any, 15);
    }
  }, [filtered, onMarkerClick]);

  return <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />;
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}