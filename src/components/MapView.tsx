import React, { useEffect, useMemo, useRef } from "react";
import L, { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import { Place } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";

/**
 * Mappa anti-“pasticciata”:
 * - Marker emoji con badge tondo bianco + ombra (alta leggibilità)
 * - Declutter: a zoom basso raggruppa i POI in cluster leggeri (senza plugin)
 * - Click cluster => zoom-in
 */

type Props = {
  places: Place[];
  selectedCategory?: string;
  className?: string;
  onMarkerClick?: (p: Place) => void;
};

const DECLUTTER_ZOOM = 12;       // sotto questo zoom, si attiva il raggruppamento
const GRID_DEG = 0.02;           // dimensione “cella” per cluster (circa ~2 km a medie latitudini)

export default function MapView({ places, selectedCategory, className, onMarkerClick }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Filtra per categoria e per record con coordinate valide
  const filtered = useMemo(() => {
    const cat = selectedCategory ? normalizeCategory(selectedCategory) : "";
    return places
      .filter(p => p.lat != null && p.lng != null)
      .filter(p => (cat ? normalizeCategory(p.category) === cat : true));
  }, [places, selectedCategory]);

  // Inizializzazione mappa + tiles OSM (no key)
  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { zoomControl: true, attributionControl: true })
        .setView([41.9028, 12.4964], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }
  }, []);

  // Render markers/clusters in base allo zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // pulisci layer precedente
    if (layerRef.current) {
      layerRef.current.clearLayers();
      map.removeLayer(layerRef.current);
    }
    layerRef.current = L.layerGroup().addTo(map);

    const zoom = map.getZoom();
    if (zoom < DECLUTTER_ZOOM) {
      // MODE: CLUSTER LEGERO
      const clusters = clusterize(filtered);
      const bounds: [number, number][] = [];

      clusters.forEach(c => {
        if (c.count === 1) {
          const p = c.items[0];
          const icon = emojiIcon(categoryEmoji(p.category));
          const m = L.marker([p.lat!, p.lng!], { icon });
          m.bindPopup(popupHtml(p));
          if (onMarkerClick) m.on("click", () => onMarkerClick(p));
          m.addTo(layerRef.current!);
          bounds.push([p.lat!, p.lng!]);
        } else {
          // marker cluster (pallino con numero)
          const m = L.marker([c.lat, c.lng], { icon: clusterIcon(c.count) });
          m.addTo(layerRef.current!);
          m.on("click", () => {
            // zoom-in morbido verso il centro del cluster
            map.setView([c.lat, c.lng], Math.min(DECLUTTER_ZOOM, zoom + 2), { animate: true });
          });
          bounds.push([c.lat, c.lng]);
        }
      });

      fitBoundsIfNeeded(map, bounds);
    } else {
      // MODE: MARKER NORMALI
      const bounds: [number, number][] = [];
      filtered.forEach(p => {
        const icon = emojiIcon(categoryEmoji(p.category));
        const m = L.marker([p.lat!, p.lng!], { icon });
        m.bindPopup(popupHtml(p));
        if (onMarkerClick) m.on("click", () => onMarkerClick(p));
        m.addTo(layerRef.current!);
        bounds.push([p.lat!, p.lng!]);
      });
      fitBoundsIfNeeded(map, bounds);
    }

    // ricostruisci markers al cambio zoom per entrare/uscire da declutter
    const onZoomEnd = () => {
      // trigger re-render ricreando il layer: usiamo trucco setTimeout per evitare loop
      setTimeout(() => {
        if (!mapRef.current) return;
        // forza il re-run dell’effetto cambiando una proprietà (qui ricalcoliamo filtered via zoom)
        // Workaround semplice: richiamare questo effect manualmente
        // In React senza stato, ricostruiamo qui direttamente:
        if (layerRef.current) {
          layerRef.current.clearLayers();
          map.removeLayer(layerRef.current);
        }
        layerRef.current = L.layerGroup().addTo(map);

        const z = map.getZoom();
        if (z < DECLUTTER_ZOOM) {
          const clusters = clusterize(filtered);
          const bounds: [number, number][] = [];
          clusters.forEach(c => {
            if (c.count === 1) {
              const p = c.items[0];
              const icon = emojiIcon(categoryEmoji(p.category));
              const m = L.marker([p.lat!, p.lng!], { icon });
              m.bindPopup(popupHtml(p));
              if (onMarkerClick) m.on("click", () => onMarkerClick(p));
              m.addTo(layerRef.current!);
              bounds.push([p.lat!, p.lng!]);
            } else {
              const m = L.marker([c.lat, c.lng], { icon: clusterIcon(c.count) });
              m.addTo(layerRef.current!);
              m.on("click", () => map.setView([c.lat, c.lng], Math.min(DECLUTTER_ZOOM, z + 2), { animate: true }));
              bounds.push([c.lat, c.lng]);
            }
          });
          fitBoundsIfNeeded(map, bounds);
        } else {
          const bounds: [number, number][] = [];
          filtered.forEach(p => {
            const icon = emojiIcon(categoryEmoji(p.category));
            const m = L.marker([p.lat!, p.lng!], { icon });
            m.bindPopup(popupHtml(p));
            if (onMarkerClick) m.on("click", () => onMarkerClick(p));
            m.addTo(layerRef.current!);
            bounds.push([p.lat!, p.lng!]);
          });
          fitBoundsIfNeeded(map, bounds);
        }
      }, 0);
    };

    map.on("zoomend", onZoomEnd);
    return () => {
      map.off("zoomend", onZoomEnd);
    };
  }, [filtered, onMarkerClick]);

  return <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />;
}

/* -------- Helpers UI -------- */

function emojiIcon(emoji: string) {
  // badge tondo bianco + ombra per leggibilità
  const html = `
    <div style="
      width:34px;height:34px;border-radius:999px;
      background:#fff; display:flex;align-items:center;justify-content:center;
      box-shadow:0 1px 4px rgba(0,0,0,.25); border:1px solid rgba(0,0,0,.06);
    ">
      <div style="font-size:20px;line-height:20px">${emoji}</div>
    </div>
  `;
  return L.divIcon({
    html,
    className: "poi-emoji-badge",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function clusterIcon(count: number) {
  // pallino blu con numero: cluster leggero senza plugin
  const html = `
    <div style="
      min-width:34px;height:34px;border-radius:999px;padding:0 8px;
      background:#1d4ed8; color:#fff; display:flex;align-items:center;justify-content:center;
      box-shadow:0 1px 4px rgba(0,0,0,.25); border:1px solid rgba(0,0,0,.06); font-weight:600;
    ">${count}</div>
  `;
  return L.divIcon({
    html,
    className: "poi-cluster-badge",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function popupHtml(p: Place) {
  const emoji = categoryEmoji(p.category);
  const name = esc(p.name);
  const city = esc(p.city);
  const country = esc(p.country);
  const img = p.image ? `<img src="${escAttr(p.image)}" alt="" style="width:100%;border-radius:8px;margin-top:6px" />` : "";
  return `
    <div style="min-width:200px">
      <div style="font-weight:600;margin-bottom:4px">${emoji} ${name}</div>
      <div style="color:#555;font-size:12px">${city}${city && country ? ", " : ""}${country}</div>
      ${img}
    </div>
  `;
}

function fitBoundsIfNeeded(map: LeafletMap, points: [number, number][]) {
  if (points.length >= 2) {
    map.fitBounds(points as LatLngBoundsExpression, { padding: [32, 32] });
  } else if (points.length === 1) {
    map.setView(points[0] as any, 15);
  }
}

/* -------- Helpers data -------- */

// Raggruppa i POI in celle griglia quando zoom è basso
function clusterize(items: Place[]) {
  type CellKey = string;
  const map = new Map<CellKey, { lat: number; lng: number; count: number; items: Place[] }>();
  for (const p of items) {
    if (p.lat == null || p.lng == null) continue;
    const ky = `${roundTo(p.lat, GRID_DEG)}|${roundTo(p.lng, GRID_DEG)}`;
    const entry = map.get(ky);
    if (!entry) {
      map.set(ky, { lat: p.lat, lng: p.lng, count: 1, items: [p] });
    } else {
      // media per posizione cluster (semplice e sufficiente per MVP)
      entry.count += 1;
      entry.items.push(p);
      entry.lat = (entry.lat * (entry.count - 1) + p.lat) / entry.count;
      entry.lng = (entry.lng * (entry.count - 1) + p.lng) / entry.count;
    }
  }
  return Array.from(map.values());
}
function roundTo(v: number, step: number) {
  return Math.round(v / step) * step;
}

/* -------- Escape -------- */
function esc(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));
}
function escAttr(s?: string) {
  return esc(s);
}