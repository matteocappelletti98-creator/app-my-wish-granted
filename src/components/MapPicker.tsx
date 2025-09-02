import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import { Button } from "@/components/ui/button";
import { Maximize2, MapPin } from "lucide-react";

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

type Props = {
  initial?: { lat: number; lng: number };
  onPick: (pos: { lat: number; lng: number }) => void;
  className?: string;
};

export default function MapPicker({ initial, onPick, className }: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, { zoomControl: true }).setView(
        initial ? [initial.lat, initial.lng] : [41.9028, 12.4964],
        12
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

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocalizzazione non supportata dal browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = { lat: latitude, lng: longitude };
        setPos(newPos);
        onPick(newPos);
        
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 15);
          if (!markerRef.current) {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapRef.current);
          } else {
            markerRef.current.setLatLng([latitude, longitude]);
          }
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Errore geolocalizzazione:", error);
        alert("Impossibile ottenere la posizione");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : className ?? "h-72 w-full rounded-2xl border"}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={getUserLocation}
          disabled={isLocating}
        >
          <MapPin className="h-4 w-4 mr-1" />
          {isLocating ? "Localizzando..." : "La mia posizione"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4" />
          {isFullscreen ? "Riduci" : "Ingrandisci"}
        </Button>
      </div>

      <div ref={containerRef} className={`h-full w-full ${isFullscreen ? '' : 'rounded-2xl'}`} style={{ minHeight: isFullscreen ? '100vh' : '300px' }} />
      
      {pos && (
        <div className={`${isFullscreen ? 'absolute bottom-4 left-4 bg-background/90 backdrop-blur p-2 rounded' : 'mt-2'} text-sm text-muted-foreground`}>
          Coordinate selezionate:{" "}
          <b>{pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}</b>
        </div>
      )}
    </div>
  );
}
