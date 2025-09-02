import React, { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";

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

    const map = L.map(containerRef.current, { zoomControl: true }).setView(
      initial ? [initial.lat, initial.lng] : [41.9028, 12.4964],
      12
    );
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
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
    return () => {
      map.off("click", click);
      map.remove();
    };
  }, [initial, onPick]);

  return (
    <div className={className ?? "h-72 w-full rounded-2xl border"}>
      <div ref={containerRef} className="h-full w-full rounded-2xl" />
      {pos && (
        <div className="mt-2 text-sm text-gray-600">
          Coordinate selezionate:{" "}
          <b>{pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}</b>
        </div>
      )}
    </div>
  );
}
