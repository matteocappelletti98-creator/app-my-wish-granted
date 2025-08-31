
import React, { useEffect, useMemo, useRef } from "react";
import L, { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import { Place } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";

type Props = {
  places: Place[];
  selectedCategory?: string; // filtro attivo
  className?: string;
  onMarkerClick?: (p: Place)=>void;
};

export default function MapView({ places, selectedCategory, className, onMarkerClick }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const filtered = useMemo(() => {
    const cat = selectedCategory ? normalizeCategory(selectedCategory) : "";
    return places.filter(p => p.lat != null && p.lng != null)
      .filter(p => cat ? normalizeCategory(p.category) === cat : true);
  }, [places, selectedCategory]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView([41.9028, 12.4964], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(mapRef.current);
    }
  }, []);

  // (re)build markers on data/filter change
  useEffect(() => {
    if (!mapRef.current) return;
    if (markersRef.current) {
      markersRef.current.clearLayers();
      mapRef.current.removeLayer(markersRef.current);
    }
    markersRef.current = L.layerGroup();
    markersRef.current.addTo(mapRef.current);

    const bounds: [number, number][] = [];

    filtered.forEach(p => {
      const emoji = categoryEmoji(p.category);
      const icon = L.divIcon({
        html: `<div style="font-size:24px; line-height:24px">${emoji}</div>`,
        className: "poi-emoji-marker",
        iconSize: [24,24],
        iconAnchor: [12,12],
      });
      const m = L.marker([p.lat!, p.lng!], { icon });
      m.bindPopup(`
        <div style="min-width:180px">
          <div style="font-weight:600;margin-bottom:4px">${emoji} ${escapeHtml(p.name)}</div>
          <div style="color:#555;font-size:12px">${escapeHtml(p.city)}${p.city && p.country ? ", " : ""}${escapeHtml(p.country)}</div>
          ${p.image ? `<img src="${escapeAttr(p.image)}" alt="" style="width:100%;border-radius:8px;margin-top:6px"/>` : ""}
        </div>
      `);
      if (onMarkerClick) m.on("click", () => onMarkerClick(p));
      m.addTo(markersRef.current!);
      bounds.push([p.lat!, p.lng!]);
    });

    // fit-to-bounds
    if (bounds.length >= 2) {
      mapRef.current.fitBounds(bounds as LatLngBoundsExpression, { padding: [32,32] });
    } else if (bounds.length === 1) {
      mapRef.current.setView(bounds[0] as any, 15);
    }
  }, [filtered, onMarkerClick]);

  return <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />;
}

// utils to avoid HTML injection in popup
function escapeHtml(s?: string){ return (s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]!)); }
function escapeAttr(s?: string){ return escapeHtml(s); }
