import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const directionsRef = useRef<MapboxDirections | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const mapboxToken = 'pk.eyJ1IjoidGVvdGVvdGVvIiwiYSI6ImNtZjI5dHo1ajFwZW8ycnM3M3FhanR5dnUifQ.crUxO5_GUe8d5htizwYyOw';

  // Filtra solo published + categoria + coordinate valide
  const filtered = useMemo(() => {
    return places
      .filter(p => p.lat != null && p.lng != null)
      .filter(p => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.some(cat => normalizeCategory(p.category) === normalizeCategory(cat));
      });
  }, [places, selectedCategories]);


  // Geolocalizzazione utente
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocalizzazione non disponibile:', error);
        }
      );
    }
  }, []);

  // Inizializza mappa Mapbox
  useEffect(() => {
    if (!containerRef.current || !mapboxToken) return;
    if (mapRef.current) return; // Già inizializzata

    mapboxgl.accessToken = mapboxToken;
    
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/teoteoteo/cmg7lnkab002601qo6yviai9g',
      center: [0, 20], // Partiamo da una vista globale centrata
      zoom: 0.8, // Zoom molto lontano per vedere il globo intero
      pitch: 0,
      bearing: 0
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Effetto turbinio: rotazione da est verso ovest integrata con zoom
    map.on('load', () => {
      // Easing personalizzato: veloce all'inizio, rallenta alla fine
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      
      setTimeout(() => {
        map.flyTo({
          center: [9.0852, 45.8081], // Como
          zoom: 12,
          pitch: 0,
          bearing: 1080, // 3 rotazioni complete da est verso ovest (direzione positiva)
          duration: 4500,
          easing: easeOutCubic,
          essential: true
        });
      }, 500);
    });
    
    // Inizializza Directions
    const directions = new MapboxDirections({
      accessToken: mapboxToken,
      unit: 'metric',
      profile: 'mapbox/walking',
      language: 'it',
      controls: {
        inputs: true,
        instructions: true,
        profileSwitcher: true,
      },
      interactive: true,
      styles: [
        {
          'id': 'directions-route-line',
          'type': 'line',
          'source': 'directions',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#3b82f6',
            'line-width': 5
          },
          'filter': [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'route', 'selected']
          ]
        }
      ]
    });
    
    directionsRef.current = directions;
    
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      directionsRef.current = null;
    };
  }, [mapboxToken]);

  // Aggiungi marker ogni volta che cambia filtered
  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;
    const map = mapRef.current;

    // Rimuovi marker esistenti
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    filtered.forEach(p => {
      const emoji = categoryEmoji(p.category);
      
      // Controlla se il POI è compatibile con il traveller path dell'utente
      const isCompatible = userTravellerCodes.length > 0 && p.tp_codes && p.tp_codes.length > 0 
        ? p.tp_codes.some(code => userTravellerCodes.includes(code))
        : false;
      
      // Crea elemento marker con cubo 4D
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width:32px;height:32px;
          background:#fff; display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(0,0,0,.3); 
          border:${isCompatible ? '2.5px solid #3b82f6' : '1px solid rgba(0,0,0,.1)'};
          cursor: pointer;
          transform-style: preserve-3d;
          animation: rotate4d 4s infinite linear;
          position: relative;
        ">
          <div style="font-size:18px;line-height:18px;position:relative;z-index:10;">${emoji}</div>
          <style>
            @keyframes rotate4d {
              0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
              25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(0deg); }
              50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(90deg); }
              75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(180deg); }
              100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
            }
          </style>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([p.lng!, p.lat!]);

      // Popup con bottoni
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
          🗺️ Google Maps
        </button>
      `;

      const directionsButton = userLocation ? `
        <button 
          onclick="getDirections(${p.lng}, ${p.lat})" 
          style="
            background: #8b5cf6; color: white; border: none; 
            border-radius: 6px; padding: 8px 12px; margin-top: 8px;
            font-size: 12px; cursor: pointer; width: 100%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          "
          title="Ottieni indicazioni dalla tua posizione"
        >
          🧭 Indicazioni stradali
        </button>
      ` : '';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="min-width:180px; position: relative;">
            ${favoriteButton}
            <div style="font-weight:600;margin-bottom:4px">${emoji} ${escapeHtml(p.name)}</div>
            <div style="color:#555;font-size:12px">${escapeHtml(p.city)}${p.city && p.country ? ", " : ""}${escapeHtml(p.country)}</div>
            ${p.image ? `<img src="${normalizeImagePath(p.image)}" alt="immagine" width="200" style="display:block;border-radius:8px;margin-top:6px;max-width:100%;height:auto"/>` : ""}
            ${detailButton}
            ${directionsButton}
            ${googleMapsButton}
          </div>
        `);

      marker.setPopup(popup);
      
      if (onMarkerClick) {
        marker.getElement().addEventListener('click', () => onMarkerClick(p));
      }

      marker.addTo(map);
      markersRef.current.push(marker);
      
      bounds.extend([p.lng!, p.lat!]);
    });

    // Fit bounds se ci sono markers
    if (filtered.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  }, [filtered, onMarkerClick, favorites, onToggleFavorite, userTravellerCodes, mapboxToken]);

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
    
    // Funzione globale per ottenere indicazioni
    (window as any).getDirections = (destLng: number, destLat: number) => {
      if (!mapRef.current || !directionsRef.current || !userLocation) return;
      
      // Aggiungi il controllo directions alla mappa se non è già stato aggiunto
      if (!mapRef.current.hasControl(directionsRef.current)) {
        mapRef.current.addControl(directionsRef.current, 'top-left');
      }
      
      // Imposta origine (posizione utente) e destinazione
      directionsRef.current.setOrigin(userLocation);
      directionsRef.current.setDestination([destLng, destLat]);
    };
    
    return () => {
      delete (window as any).toggleFavorite;
      delete (window as any).goToPlace;
      delete (window as any).openInGoogleMaps;
      delete (window as any).getDirections;
    };
  }, [onToggleFavorite, userLocation]);

  return (
    <div className="relative">
      <style>{`
        @media (max-width: 768px) {
          .mapboxgl-ctrl-directions {
            width: 100% !important;
            max-width: 100% !important;
          }
          .directions-control {
            width: 100% !important;
          }
          .mapbox-directions-component {
            width: 100% !important;
            max-width: 100% !important;
          }
          .mapbox-directions-inputs {
            width: 100% !important;
          }
          .mapbox-directions-instructions {
            max-height: 40vh !important;
            overflow-y: auto !important;
          }
        }
      `}</style>
      <div ref={containerRef} className={className ?? "h-[70vh] w-full rounded-2xl border"} />
    </div>
  );
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}
