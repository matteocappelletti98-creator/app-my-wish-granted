import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import { Place, normalizeImagePath } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  const isFirstLoadRef = useRef(true);
  const mapboxToken = 'pk.eyJ1IjoidGVvdGVvdGVvIiwiYSI6ImNtZjI5dHo1ajFwZW8ycnM3M3FhanR5dnUifQ.crUxO5_GUe8d5htizwYyOw';
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Filtra solo published + categoria + coordinate valide
  const filtered = useMemo(() => {
    return places
      .filter(p => p.lat != null && p.lng != null)
      .filter(p => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.includes(normalizeCategory(p.category));
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

    // Effetto cascata solo al primissimo caricamento
    const shouldAnimate = isFirstLoadRef.current;
    
    filtered.forEach((p, index) => {
      const emoji = categoryEmoji(p.category);
      
      // Controlla se il POI è compatibile con il traveller path dell'utente
      const isCompatible = userTravellerCodes.length > 0 && p.tp_codes && p.tp_codes.length > 0 
        ? p.tp_codes.some(code => userTravellerCodes.includes(code))
        : false;
      
      // Delay casuale per ogni marker per effetto caduta multipla
      const delay = (index * 50) + Math.random() * 200;
      
      // Crea elemento marker con animazione di caduta
      const el = document.createElement('div');
      const animationName = isCompatible ? 'fall-from-west' : 'fall-from-sky';
      el.innerHTML = `
        <style>
          @keyframes fall-from-sky {
            0% {
              transform: translate(1000px, -1000px) rotate(0deg) scale(0.3);
              opacity: 0;
            }
            70% {
              opacity: 1;
            }
            85% {
              transform: translate(0, 10px) rotate(720deg) scale(1.1);
            }
            100% {
              transform: translate(0, 0) rotate(720deg) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes fall-from-west {
            0% {
              transform: translate(-1500px, -1200px) rotate(0deg) scale(0.3);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            65% {
              transform: translate(0, 0) rotate(-720deg) scale(1);
            }
            80% {
              transform: translate(0, 0) rotate(-720deg) scale(1);
            }
            90% {
              transform: translate(0, 0) rotate(-720deg) scale(2.5);
            }
            100% {
              transform: translate(0, 0) rotate(-720deg) scale(1);
              opacity: 1;
            }
          }
        </style>
        <div style="
          width:30px;height:30px;border-radius:999px;
          background:#fff; display:flex;align-items:center;justify-content:center;
          box-shadow:${isCompatible ? '0 0 20px 4px rgba(59, 130, 246, 0.8), 0 0 40px 8px rgba(59, 130, 246, 0.5), 0 0 60px 12px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,.3)' : '0 2px 8px rgba(0,0,0,.3), 0 0 20px rgba(59, 130, 246, 0.3)'}; 
          border:${isCompatible ? '3px solid #3b82f6' : '1px solid rgba(0,0,0,.1)'};
          cursor: pointer;
          ${shouldAnimate ? `animation: ${animationName} ${isCompatible ? '3.5s' : '2.5s'} ease-out ${delay}ms forwards; opacity: 0;` : 'opacity: 1;'}
        ">
          <div style="font-size:18px;line-height:18px">${emoji}</div>
        </div>
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([p.lng!, p.lat!]);

      // Quando si clicca sul marker, mostra la card
      marker.getElement().addEventListener('click', () => {
        setSelectedPlace(p);
        if (onMarkerClick) {
          onMarkerClick(p);
        }
      });

      marker.addTo(map);
      markersRef.current.push(marker);
      
      bounds.extend([p.lng!, p.lat!]);
    });

    // Fit bounds se ci sono markers
    if (filtered.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
      
      // Disabilita l'animazione dopo il primo caricamento (quando ci sono marker da mostrare)
      if (isFirstLoadRef.current) {
        // Usiamo setTimeout per dare tempo ai marker di essere aggiunti al DOM
        setTimeout(() => {
          isFirstLoadRef.current = false;
        }, 500);
      }
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
    <>
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
        
        {/* Overlay scuro quando viene selezionato un POI */}
        {selectedPlace && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setSelectedPlace(null)}
          />
        )}
        
        {/* Card striscia in fondo tipo Google Maps */}
        {selectedPlace && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg animate-in slide-in-from-bottom duration-300">
            <div className="container mx-auto max-w-5xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0 mt-1">{categoryEmoji(selectedPlace.category)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1">{selectedPlace.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{selectedPlace.category}</p>
                    {selectedPlace.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{selectedPlace.description}</p>
                    )}
                    {selectedPlace.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>📍</span> {selectedPlace.address}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedPlace(null)}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (onToggleFavorite) {
                      onToggleFavorite(selectedPlace.id);
                    }
                  }}
                  className="w-full"
                >
                  {favorites.includes(selectedPlace.id) ? '❤️' : '🤍'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    window.location.href = `/luogo/${selectedPlace.slug}`;
                  }}
                  className="w-full"
                >
                  👁️ View
                </Button>
                
                <Button
                  onClick={() => {
                    const query = encodeURIComponent(
                      selectedPlace.name + ' ' + (selectedPlace.address || selectedPlace.city || '')
                    );
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  }}
                  className="w-full"
                >
                  📍 Maps
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}
