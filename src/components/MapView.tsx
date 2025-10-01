import React, { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
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

const ACCESS_TOKEN = 'pk.eyJ1IjoidGVvdGVvdGVvIiwiYSI6ImNtZjI5dHo1ajFwZW8ycnM3M3FhanR5dnUifQ.crUxO5_GUe8d5htizwYyOw';

export default function MapView({ places, selectedCategories = [], className, onMarkerClick, favorites = [], onToggleFavorite, userTravellerCodes = [] }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

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
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = ACCESS_TOKEN;
    
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [12.4964, 41.9028], // Roma
      zoom: 12
    });

    // Aggiungi controlli di navigazione
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Aggiungi geocoder (search box)
    const geocoder = new MapboxGeocoder({
      accessToken: ACCESS_TOKEN,
      mapboxgl: mapboxgl,
      language: 'it',
      countries: 'IT',
      marker: {
        color: '#3b82f6'
      },
      placeholder: 'Cerca un luogo...'
    });
    
    map.addControl(geocoder, 'top-left');

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

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

  // Aggiungi marker ogni volta che cambia filtered
  useEffect(() => {
    if (!mapRef.current) return;

    // Rimuovi marker esistenti
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidBounds = false;

    filtered.forEach(p => {
      const emoji = categoryEmoji(p.category);
      
      // Controlla se il POI è compatibile con il traveller path dell'utente
      const isCompatible = userTravellerCodes.length > 0 && p.tp_codes && p.tp_codes.length > 0 
        ? p.tp_codes.some(code => userTravellerCodes.includes(code))
        : false;
      
      // Crea elemento HTML per il marker
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width:34px;height:34px;border-radius:999px;
          background:#fff; display:flex;align-items:center;justify-content:center;
          box-shadow:0 1px 4px rgba(0,0,0,.25); 
          border:${isCompatible ? '3px solid #3b82f6' : '1px solid rgba(0,0,0,.06)'};
          animation: ${isCompatible ? 'zoom-bounce 1.2s ease-out' : 'none'};
          cursor: pointer;
        ">
          <div style="font-size:20px;line-height:20px">${emoji}</div>
        </div>
      `;

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

      const popupContent = `
        <div style="min-width:180px; position: relative;">
          ${favoriteButton}
          <div style="font-weight:600;margin-bottom:4px">${emoji} ${escapeHtml(p.name)}</div>
          <div style="color:#555;font-size:12px">${escapeHtml(p.city)}${p.city && p.country ? ", " : ""}${escapeHtml(p.country)}</div>
          ${p.image ? `<img src="${normalizeImagePath(p.image)}" alt="immagine" width="200" style="display:block;border-radius:8px;margin-top:6px;max-width:100%;height:auto"/>` : ""}
          ${detailButton}
          ${googleMapsButton}
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([p.lng!, p.lat!])
        .setPopup(popup)
        .addTo(mapRef.current!);

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(p));
      }

      markersRef.current.push(marker);
      bounds.extend([p.lng!, p.lat!]);
      hasValidBounds = true;
    });

    // fit-to-bounds
    if (hasValidBounds) {
      mapRef.current.fitBounds(bounds, { 
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
    }
  }, [filtered, onMarkerClick, favorites, onToggleFavorite, userTravellerCodes]);

  return (
    <>
      <style>{`
        @keyframes zoom-bounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          75% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .mapboxgl-ctrl-bottom-left,
        .mapboxgl-ctrl-bottom-right {
          display: none;
        }
      `}</style>
      <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl"} />
    </>
  );
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}
