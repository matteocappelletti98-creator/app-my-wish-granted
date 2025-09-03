import React, { useEffect, useMemo, useRef, useState } from "react";
import L, { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import { Place } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";
import { CITIES, City, CityStatus } from "@/types/city";
import { useCityStatus } from "@/hooks/useCityStatus";
import CityBanner from "@/components/CityBanner";

type Props = {
  places: Place[];
  selectedCategory?: string;
  className?: string;
  onMarkerClick?: (p: Place) => void;
  showCityCircles?: boolean;
  isHomeStyle?: boolean; // Per usare lo stile della home
};

export default function MapView({ places, selectedCategory, className, onMarkerClick, showCityCircles = false, isHomeStyle = false }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const cityCirclesRef = useRef<L.LayerGroup | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ city: City; position: { x: number; y: number } } | null>(null);
  const { getCityStatus, updateCityStatus } = useCityStatus();

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
      const map = L.map(containerRef.current, { zoomControl: true }).setView([41.9028, 12.4964], 6);
      mapRef.current = map;

      // Tile layer - stile diverso per home vs altre pagine
      const tileUrl = isHomeStyle 
        ? "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      
      const attribution = isHomeStyle
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        : "© OpenStreetMap contributors";

      L.tileLayer(tileUrl, {
        attribution,
        maxZoom: 20,
      }).addTo(map);

      // Click handler per chiudere banner
      map.on('click', () => {
        setSelectedCity(null);
      });
    }
  }, []);

  // Gestisci cerchi delle città
  useEffect(() => {
    if (!mapRef.current || !showCityCircles) return;

    if (cityCirclesRef.current) {
      cityCirclesRef.current.clearLayers();
      mapRef.current.removeLayer(cityCirclesRef.current);
    }
    cityCirclesRef.current = L.layerGroup().addTo(mapRef.current);

    Object.values(CITIES).forEach(city => {
      const status = getCityStatus(city.id);
      const isPending = city.status === 'pending';
      
      let color = '#3b82f6'; // blue default
      if (isPending) color = '#ef4444'; // red for pending
      else if (status === 'wishlist') color = '#22c55e'; // green for wishlist
      else if (status === 'visited') color = '#8b5cf6'; // purple for visited

      const circle = L.circle([city.lat, city.lng], {
        color,
        fillColor: 'transparent',
        fillOpacity: 0,
        weight: 2,
        radius: 50000, // 50km
        interactive: true
      });

      circle.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        const containerPoint = mapRef.current!.latLngToContainerPoint(e.latlng);
        setSelectedCity({
          city,
          position: { x: containerPoint.x, y: containerPoint.y }
        });
      });

      circle.addTo(cityCirclesRef.current!);
    });
  }, [showCityCircles, getCityStatus]);

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
            box-shadow:0 1px 4px rgba(0,0,0,.25);
          ">
            <div style="font-size:20px;line-height:20px">${emoji}</div>
          </div>
        `,
        className: "poi-emoji-badge",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const m = L.marker([p.lat!, p.lng!], { icon });

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

    // fit-to-bounds solo se non ci sono cerchi delle città
    if (!showCityCircles) {
      if (bounds.length >= 2) {
        mapRef.current.fitBounds(bounds as LatLngBoundsExpression, { padding: [32, 32] });
      } else if (bounds.length === 1) {
        mapRef.current.setView(bounds[0] as any, 15);
      }
    }
  }, [filtered, onMarkerClick, showCityCircles]);

  const handleCityAction = (action: 'zoom' | 'wishlist' | 'visited') => {
    if (!selectedCity) return;

    switch (action) {
      case 'zoom':
        mapRef.current?.setView([selectedCity.city.lat, selectedCity.city.lng], 10);
        break;
      case 'wishlist':
        updateCityStatus(selectedCity.city.id, 'wishlist');
        break;
      case 'visited':
        updateCityStatus(selectedCity.city.id, 'visited');
        break;
    }
    setSelectedCity(null);
  };

  return (
    <div className="relative">
      <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />
      {selectedCity && (
        <CityBanner
          city={selectedCity.city}
          position={selectedCity.position}
          onAction={handleCityAction}
          onClose={() => setSelectedCity(null)}
        />
      )}
    </div>
  );
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}