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
