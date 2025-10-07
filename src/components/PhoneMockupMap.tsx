import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Place } from "@/lib/sheet";
import { categoryEmoji } from "@/components/CategoryBadge";

type Props = {
  places: Place[];
  className?: string;
};

export default function PhoneMockupMap({ places, className }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const mapboxToken = 'pk.eyJ1IjoidGVvdGVvdGVvIiwiYSI6ImNtZjI5dHo1ajFwZW8ycnM3M3FhanR5dnUifQ.crUxO5_GUe8d5htizwYyOw';

  useEffect(() => {
    if (!containerRef.current || !mapboxToken || places.length === 0) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/teoteoteo/cmg7lnkab002601qo6yviai9g',
      center: [9.0852, 45.8081],
      zoom: 12,
      interactive: true,
      attributionControl: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
    
    map.on('load', () => {
      // Aggiungi marker
      places
        .filter(p => p.lat != null && p.lng != null)
        .forEach((p) => {
          const emoji = categoryEmoji(p.category);
          
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="
              width:24px;height:24px;border-radius:999px;
              background:#fff; display:flex;align-items:center;justify-content:center;
              box-shadow:0 2px 8px rgba(0,0,0,.3); 
              border:1px solid rgba(0,0,0,.1);
              cursor: pointer;
            ">
              <div style="font-size:14px;line-height:14px">${emoji}</div>
            </div>
          `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([p.lng!, p.lat!])
            .addTo(map);

          markersRef.current.push(marker);
        });
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.remove();
      mapRef.current = null;
    };
  }, [places, mapboxToken]);

  return <div ref={containerRef} className={className ?? "h-full w-full"} />;
}
