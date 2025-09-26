import React, { useEffect, useMemo, useRef } from "react";
import L, { Map as LeafletMap, LatLngBoundsExpression } from "leaflet";
import { Place, normalizeImagePath } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";

type Props = {
  places: Place[];
  selectedCategories?: string[];
  className?: string;
  onMarkerClick?: (p: Place) => void;
  favorites?: string[];
  onToggleFavorite?: (placeId: string) => void;
  userTravellerCodes?: number[];
};

export default function MapView({ places, selectedCategories = [], className, onMarkerClick, favorites = [], onToggleFavorite, userTravellerCodes = [] }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Filtra solo published + categoria + coordinate valide
  const filtered = useMemo(() => {
    return places
      .filter(p => p.lat != null && p.lng != null)
      .filter(p => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.some(cat => normalizeCategory(p.category) === normalizeCategory(cat));
      });
  }, [places, selectedCategories]);

  // Inizializza mappa una sola volta
  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      const map = L.map(containerRef.current, { zoomControl: true }).setView([41.9028, 12.4964], 12);
      mapRef.current = map;

      // Tile layer (Carto Positron)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
        subdomains: "abcd",
        maxZoom: 20,
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
      
      // Controlla se il POI è compatibile con il traveller path dell'utente
      const isCompatible = userTravellerCodes.length > 0 && p.tp_codes && p.tp_codes.length > 0 
        ? p.tp_codes.some(code => userTravellerCodes.includes(code))
        : false;
      
      const icon = L.divIcon({
        html: `
          <div style="
            width:34px;height:34px;border-radius:999px;
            background:#fff; display:flex;align-items:center;justify-content:center;
            box-shadow:0 1px 4px rgba(0,0,0,.25); 
            border:${isCompatible ? '3px solid #3b82f6' : '1px solid rgba(0,0,0,.06)'};
          ">
            <div style="font-size:20px;line-height:20px">${emoji}</div>
          </div>
        `,
        className: "poi-emoji-badge",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const m = L.marker([p.lat!, p.lng!], { icon });

      // Popup con bottone preferiti e bottone dettaglio
      const favoriteButton = onToggleFavorite ? `
        <button 
          onclick="toggleFavorite('${p.id}')" 
          style="
            position: absolute; top: 8px; right: 8px; 
            background: rgba(255,255,255,0.9); border: none; 
            border-radius: 50%; width: 28px; height: 28px; 
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "
          title="${favorites.includes(p.id) ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}"
        >
          <span style="color: ${favorites.includes(p.id) ? '#ef4444' : '#9ca3af'}; font-size: 14px;">
            ${favorites.includes(p.id) ? '❤️' : '🤍'}
          </span>
        </button>
      ` : '';

      // Bottone per entrare nel luogo (per tutti i luoghi)
      const detailButton = `
        <button 
          onclick="goToPlace('${p.slug}')" 
          style="
            background: #3b82f6; color: white; border: none; 
            border-radius: 6px; padding: 8px 12px; margin-top: 8px;
            font-size: 12px; cursor: pointer; width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "
          title="Vai alla pagina del luogo"
        >
          🚪 Entra
        </button>
      `;

      const googleMapsButton = `
        <button 
          onclick="openInGoogleMaps('${encodeURIComponent(p.name + ' ' + (p.address || p.city || ''))}')" 
          style="
            background: #34d399; color: white; border: none; 
            border-radius: 6px; padding: 8px 12px; margin-top: 8px;
            font-size: 12px; cursor: pointer; width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "
          title="Apri in Google Maps"
        >
          🗺️ Apri in Google Maps
        </button>
      `;

      m.bindPopup(`
        <div style="min-width:180px; position: relative;">
          ${favoriteButton}
          <div style="font-weight:600;margin-bottom:4px">${emoji} ${escapeHtml(p.name)}</div>
          <div style="color:#555;font-size:12px">${escapeHtml(p.city)}${p.city && p.country ? ", " : ""}${escapeHtml(p.country)}</div>
          ${p.image ? `<img src="${normalizeImagePath(p.image)}" alt="immagine" width="200" style="display:block;border-radius:8px;margin-top:6px;max-width:100%;height:auto"/>` : ""}
          ${detailButton}
          ${googleMapsButton}
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
  }, [filtered, onMarkerClick, favorites, onToggleFavorite, userTravellerCodes]);

  // Aggiungi funzioni globali per il toggle dei preferiti e navigazione
  useEffect(() => {
    if (onToggleFavorite) {
      (window as any).toggleFavorite = onToggleFavorite;
    }
    
    // Funzione globale per navigare al luogo
    (window as any).goToPlace = (slug: string) => {
      window.location.href = `/luogo/${slug}`;
    };
    
    // Funzione globale per aprire in Google Maps
    (window as any).openInGoogleMaps = (searchQuery: string) => {
      const url = `https://www.google.com/maps/search/?api=1&query=${searchQuery}`;
      window.open(url, '_blank');
    };
    
    return () => {
      delete (window as any).toggleFavorite;
      delete (window as any).goToPlace;
      delete (window as any).openInGoogleMaps;
    };
  }, [onToggleFavorite]);

  return <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />;
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}