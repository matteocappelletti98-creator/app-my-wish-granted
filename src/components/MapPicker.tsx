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
  barcellona: { lat: 41.3851, lng: 2.1734, name: "Barcellona" },
  losangeles: { lat: 34.0522, lng: -118.2437, name: "Los Angeles" },
  lasvegas: { lat: 36.1699, lng: -115.1398, name: "Las Vegas" },
  orlando: { lat: 28.5383, lng: -81.3792, name: "Orlando" },
  miami: { lat: 25.7617, lng: -80.1918, name: "Miami" },
  sanfrancisco: { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
  washington: { lat: 38.9072, lng: -77.0369, name: "Washington" },
  honolulu: { lat: 21.3099, lng: -157.8581, name: "Honolulu" },
  toronto: { lat: 43.6532, lng: -79.3832, name: "Toronto" },
  vancouver: { lat: 49.2827, lng: -123.1207, name: "Vancouver" },
  montreal: { lat: 45.5017, lng: -73.5673, name: "Montréal" },
  cittadelmessico: { lat: 19.4326, lng: -99.1332, name: "Città del Messico" },
  cancun: { lat: 21.1619, lng: -86.8515, name: "Cancún" },
  puntacana: { lat: 18.5601, lng: -68.3725, name: "Punta Cana" },
  buenosaires: { lat: -34.6118, lng: -58.3960, name: "Buenos Aires" },
  santiago: { lat: -33.4489, lng: -70.6693, name: "Santiago" },
  bogota: { lat: 4.7110, lng: -74.0721, name: "Bogotá" },
  riodejaneiro: { lat: -22.9068, lng: -43.1729, name: "Rio de Janeiro" },
  saopaulo: { lat: -23.5505, lng: -46.6333, name: "San Paolo" },
  lima: { lat: -12.0464, lng: -77.0428, name: "Lima" },
  sydney: { lat: -33.8688, lng: 151.2093, name: "Sydney" },
  melbourne: { lat: -37.8136, lng: 144.9631, name: "Melbourne" },
  perth: { lat: -31.9505, lng: 115.8605, name: "Perth" },
  brisbane: { lat: -27.4698, lng: 153.0251, name: "Brisbane" },
  tokyo: { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
  osaka: { lat: 34.6937, lng: 135.5023, name: "Osaka" },
  kyoto: { lat: 35.0116, lng: 135.7681, name: "Kyoto" },
  fukuoka: { lat: 33.5904, lng: 130.4017, name: "Fukuoka" },
  sapporo: { lat: 43.0642, lng: 141.3469, name: "Sapporo" },
  pechino: { lat: 39.9042, lng: 116.4074, name: "Pechino" },
  shanghai: { lat: 31.2304, lng: 121.4737, name: "Shanghai" },
  guangzhou: { lat: 23.1291, lng: 113.2644, name: "Guangzhou" },
  shenzhen: { lat: 22.5431, lng: 114.0579, name: "Shenzhen" },
  zhuhai: { lat: 22.2711, lng: 113.5767, name: "Zhuhai" },
  macao: { lat: 22.1987, lng: 113.5439, name: "Macao" },
  hongkong: { lat: 22.3193, lng: 114.1694, name: "Hong Kong" },
  singapore: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  phuket: { lat: 7.8804, lng: 98.3923, name: "Phuket" },
  pattaya: { lat: 12.9236, lng: 100.8825, name: "Pattaya-Chonburi" },
  kualalumpur: { lat: 3.1390, lng: 101.6869, name: "Kuala Lumpur" },
  nizza: { lat: 43.7102, lng: 7.2620, name: "Nizza" },
  marsiglia: { lat: 43.2965, lng: 5.3698, name: "Marsiglia" },
  lione: { lat: 45.7640, lng: 4.8357, name: "Lione" },
  marnelavalee: { lat: 48.8747, lng: 2.7794, name: "Marne-la-Vallée" },
  madrid: { lat: 40.4168, lng: -3.7038, name: "Madrid" },
  siviglia: { lat: 37.3886, lng: -5.9823, name: "Siviglia" },
  valencia: { lat: 39.4699, lng: -0.3763, name: "Valencia" },
  palmadimallorca: { lat: 39.5696, lng: 2.6502, name: "Palma di Mallorca" },
  firenze: { lat: 43.7696, lng: 11.2558, name: "Firenze" },
  venezia: { lat: 45.4408, lng: 12.3155, name: "Venezia" },
  napoli: { lat: 40.8518, lng: 14.2681, name: "Napoli" },
  bologna: { lat: 44.4949, lng: 11.3426, name: "Bologna" },
  verona: { lat: 45.4384, lng: 10.9916, name: "Verona" },
  londra: { lat: 51.5074, lng: -0.1278, name: "Londra" },
  edimburgo: { lat: 55.9533, lng: -3.1883, name: "Edimburgo" },
  monaco: { lat: 48.1351, lng: 11.5820, name: "Monaco di Baviera" },
  francoforte: { lat: 50.1109, lng: 8.6821, name: "Francoforte sul Meno" },
  amburgo: { lat: 53.5511, lng: 9.9937, name: "Amburgo" },
  vienna: { lat: 48.2082, lng: 16.3738, name: "Vienna" },
  salisburgo: { lat: 47.8095, lng: 13.0550, name: "Salisburgo" },
  amsterdam: { lat: 52.3676, lng: 4.9041, name: "Amsterdam" },
  rotterdam: { lat: 51.9225, lng: 4.4792, name: "Rotterdam" },
  bruxelles: { lat: 50.8503, lng: 4.3517, name: "Bruxelles" },
  bruges: { lat: 51.2093, lng: 3.2247, name: "Bruges" },
  zurigo: { lat: 47.3769, lng: 8.5417, name: "Zurigo" },
  ginevra: { lat: 46.2044, lng: 6.1432, name: "Ginevra" },
  copenaghen: { lat: 55.6761, lng: 12.5683, name: "Copenaghen" },
  stoccolma: { lat: 59.3293, lng: 18.0686, name: "Stoccolma" },
  helsinki: { lat: 60.1699, lng: 24.9384, name: "Helsinki" },
  varsavia: { lat: 52.2297, lng: 21.0122, name: "Varsavia" },
  cracovia: { lat: 50.0647, lng: 19.9450, name: "Cracovia" },
  atene: { lat: 37.9838, lng: 23.7275, name: "Atene" },
  heraklion: { lat: 35.3387, lng: 25.1442, name: "Heraklion" },
  rodi: { lat: 36.4341, lng: 28.2176, name: "Rodi" },
  salonicco: { lat: 40.6401, lng: 22.9444, name: "Salonicco" },
  budapest: { lat: 47.4979, lng: 19.0402, name: "Budapest" },
  riga: { lat: 56.9496, lng: 24.1052, name: "Riga" },
  vilnius: { lat: 54.6872, lng: 25.2797, name: "Vilnius" },
  tallinn: { lat: 59.4370, lng: 24.7536, name: "Tallinn" },
  mosca: { lat: 55.7558, lng: 37.6176, name: "Mosca" },
  sanpietroburgo: { lat: 59.9311, lng: 30.3609, name: "San Pietroburgo" },
  tbilisi: { lat: 41.7151, lng: 44.8271, name: "Tbilisi" },
  ilcairo: { lat: 30.0444, lng: 31.2357, name: "Il Cairo" },
  marrakech: { lat: 31.6295, lng: -7.9811, name: "Marrakech" }
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
  const circlesRef = useRef<L.Circle[]>([]);
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(
    initial ?? null
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

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

      // Aggiungi tutti i cerchi delle città
      Object.values(CITIES).forEach(city => {
        const circle = L.circle([city.lat, city.lng], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          radius: 50000 // 50km in metri
        }).addTo(map);
        circlesRef.current.push(circle);
      });

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
        circlesRef.current = [];
      };
    } catch (error) {
      console.error("Errore nell'inizializzazione della mappa:", error);
    }
  }, []);

  // Aggiorna centro mappa quando cambia la città
  useEffect(() => {
    if (!mapRef.current) return;

    const cityData = CITIES[selectedCity as keyof typeof CITIES] || CITIES.como;
    
    // Centra la mappa sulla città
    mapRef.current.setView([cityData.lat, cityData.lng], 10);
  }, [selectedCity]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : className ?? "h-72 w-full rounded-2xl border"}`}>
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 z-10 bg-white border border-gray-300 rounded-md p-2 shadow-sm hover:bg-gray-50"
          title={isFullscreen ? "Esci da schermo intero" : "Schermo intero"}
        >
          {isFullscreen ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          )}
        </button>
        <div ref={containerRef} className={`${isFullscreen ? 'h-full' : 'h-full'} w-full rounded-2xl`} style={{ minHeight: isFullscreen ? '100vh' : '300px' }} />
      </div>
      {!isFullscreen && pos && (
        <div className="mt-2 text-sm text-gray-600">
          Coordinate selezionate:{" "}
          <b>{pos.lat.toFixed(6)}, {pos.lng.toFixed(6)}</b>
        </div>
      )}
    </>
  );
}
