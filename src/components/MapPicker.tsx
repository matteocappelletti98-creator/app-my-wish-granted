import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";

// Fix per le icone di default di Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Definizione delle città con coordinate
const CITIES = {
  como: { lat: 45.8081, lng: 9.0852, name: "Como" },
  newyork: { lat: 40.7128, lng: -74.0060, name: "New York" },
  bangkok: { lat: 13.7563, lng: 100.5018, name: "Bangkok" },
  parigi: { lat: 48.8566, lng: 2.3522, name: "Parigi" },
  roma: { lat: 41.9028, lng: 12.4964, name: "Roma" },
  milano: { lat: 45.4642, lng: 9.1900, name: "Milano" },
  berlino: { lat: 52.5200, lng: 13.4050, name: "Berlino" },
  barcellona: { lat: 41.3851, lng: 2.1734, name: "Barcellona" }
};

type Props = {
  initial?: { lat: number; lng: number };
  onPick: (pos: { lat: number; lng: number }) => void;
  className?: string;
  selectedCity?: string;
};

export default function MapPicker({ initial, onPick, className, selectedCity = "como" }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );

  // Inizializza mappa
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const cityData = CITIES[selectedCity as keyof typeof CITIES] || CITIES.como;
      const map = L.map(containerRef.current, { zoomControl: true }).setView(
        [cityData.lat, cityData.lng],
        10
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 20,
      }).addTo(map);

      const click = (e: any) => {
        const { lat, lng } = e.latlng;
        setPos({ lat, lng });
        if (!markerRef.current) {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        } else {
          markerRef.current.setLatLng([lat, lng]);
        }
        onPick({ lat, lng });
      };

      map.on("click", click);
      
      // Cleanup function
      return () => {
        if (mapRef.current) {
          mapRef.current.off("click", click);
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
    }
  }, []);

  // Aggiorna cerchio e centro mappa quando cambia la città
  useEffect(() => {
    if (!mapRef.current) return;

    const cityData = CITIES[selectedCity as keyof typeof CITIES] || CITIES.como;
    
    // Rimuovi cerchio precedente
    if (circleRef.current) {
      mapRef.current.removeLayer(circleRef.current);
    }

    // Aggiungi nuovo cerchio di 50km
    circleRef.current = L.circle([cityData.lat, cityData.lng], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      radius: 50000 // 50km in metri
    }).addTo(mapRef.current);

    // Centra la mappa sulla città
    mapRef.current.setView([cityData.lat, cityData.lng], 10);
  }, [selectedCity]);

  return (
    <div className={className ?? "h-72 w-full rounded-2xl border"}>
      <div ref={containerRef} className="h-full w-full rounded-2xl" style={{ minHeight: '300px' }} />
      {pos && (
        <div className="mt-2 text-sm text-gray-600">
          Coordinate selezionate:{" "}
          <b>{pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}</b>
        </div>
      )}
    </div>
  );
}
