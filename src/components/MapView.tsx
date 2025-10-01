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
  const watchIdRef = useRef<number | null>(null);
  const currentRouteRef = useRef<any>(null);
  const lastSpokenStepRef = useRef<number>(-1);
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState<any>(null);
  const [nextStep, setNextStep] = useState<any>(null);
  const [distanceToNextStep, setDistanceToNextStep] = useState<number>(0);
  
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


  // Funzione per calcolare distanza tra due punti (Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Text-to-speech per istruzioni vocali
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'it-IT';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Geolocalizzazione iniziale
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

  // Tracking continuo durante la navigazione
  useEffect(() => {
    if (!isNavigating || !currentRouteRef.current) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation: [number, number] = [position.coords.longitude, position.coords.latitude];
          setUserLocation(newLocation);

          // Aggiorna marker utente sulla mappa
          if (mapRef.current) {
            const userMarker = document.getElementById('user-location-marker');
            if (userMarker) {
              userMarker.remove();
            }
            
            const el = document.createElement('div');
            el.id = 'user-location-marker';
            el.innerHTML = `
              <div style="
                width:20px;height:20px;border-radius:50%;
                background:#3b82f6;border:3px solid white;
                box-shadow:0 2px 4px rgba(0,0,0,0.3);
              "></div>
            `;
            
            new mapboxgl.Marker(el)
              .setLngLat(newLocation)
              .addTo(mapRef.current);
          }

          // Trova step corrente in base alla posizione
          const route = currentRouteRef.current;
          if (route && route.legs && route.legs[0] && route.legs[0].steps) {
            const steps = route.legs[0].steps;
            
            for (let i = 0; i < steps.length; i++) {
              const step = steps[i];
              const stepCoords = step.maneuver.location;
              const distance = calculateDistance(
                newLocation[1], newLocation[0],
                stepCoords[1], stepCoords[0]
              );

              // Se siamo vicini a uno step (entro 50m)
              if (distance < 50 && i !== lastSpokenStepRef.current) {
                setCurrentStep(step);
                setNextStep(steps[i + 1] || null);
                
                // Pronuncia l'istruzione
                const instruction = step.maneuver.instruction;
                speak(instruction);
                lastSpokenStepRef.current = i;
                break;
              }

              // Calcola distanza al prossimo step
              if (i === lastSpokenStepRef.current + 1) {
                setDistanceToNextStep(Math.round(distance));
                setNextStep(step);
              }
            }

            // Ricalcola se troppo lontano dal percorso (oltre 100m)
            const routeCoordinates = route.geometry.coordinates;
            let minDistanceToRoute = Infinity;
            
            for (const coord of routeCoordinates) {
              const dist = calculateDistance(
                newLocation[1], newLocation[0],
                coord[1], coord[0]
              );
              if (dist < minDistanceToRoute) {
                minDistanceToRoute = dist;
              }
            }

            if (minDistanceToRoute > 100) {
              speak("Ricalcolo del percorso");
              // Ricalcola percorso
              if (directionsRef.current) {
                const destination = routeCoordinates[routeCoordinates.length - 1];
                directionsRef.current.setOrigin(newLocation);
                directionsRef.current.setDestination(destination);
              }
            }
          }
        },
        (error) => {
          console.log('Errore tracking GPS:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isNavigating]);

  // Inizializza mappa Mapbox
  useEffect(() => {
    if (!containerRef.current || !mapboxToken) return;
    if (mapRef.current) return; // Già inizializzata

    mapboxgl.accessToken = mapboxToken;
    
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/teoteoteo/cmg7lnkab002601qo6yviai9g',
      center: [9.0852, 45.8081], // Como, Lombardia
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
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
    
    // Listener per quando viene calcolato un percorso
    directions.on('route', (e: any) => {
      if (e.route && e.route[0]) {
        currentRouteRef.current = e.route[0];
      }
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
      
      // Crea elemento marker
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width:34px;height:34px;border-radius:999px;
          background:#fff; display:flex;align-items:center;justify-content:center;
          box-shadow:0 1px 4px rgba(0,0,0,.25); 
          border:${isCompatible ? '3px solid #3b82f6' : '1px solid rgba(0,0,0,.06)'};
          cursor: pointer;
        ">
          <div style="font-size:20px;line-height:20px">${emoji}</div>
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
      
      // Avvia la navigazione
      setIsNavigating(true);
      lastSpokenStepRef.current = -1;
      speak("Navigazione avviata");
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
      
      {/* Pannello navigatore GPS */}
      {isNavigating && nextStep && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-6 max-w-md w-[90%]">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-5xl font-bold text-primary mb-2">
                {distanceToNextStep}m
              </div>
              <div className="text-xl font-semibold">
                {nextStep.maneuver.instruction}
              </div>
            </div>
            <button
              onClick={() => {
                setIsNavigating(false);
                currentRouteRef.current = null;
                lastSpokenStepRef.current = -1;
                window.speechSynthesis.cancel();
                if (directionsRef.current && mapRef.current) {
                  directionsRef.current.removeRoutes();
                }
              }}
              className="ml-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-destructive/90"
            >
              Stop
            </button>
          </div>
          
          {currentStep && (
            <div className="text-sm text-muted-foreground mt-2 pt-2 border-t">
              Istruzione attuale: {currentStep.maneuver.instruction}
            </div>
          )}
        </div>
      )}
      
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
