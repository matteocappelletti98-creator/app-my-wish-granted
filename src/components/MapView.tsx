import React, { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Place, normalizeImagePath } from "@/lib/sheet";
import { categoryEmoji, normalizeCategory } from "@/components/CategoryBadge";
import LinkifiedText from "@/components/LinkifiedText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, MapPin, ChevronLeft, ChevronRight, Upload, Trash2, Search, Heart, Map } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  lat: number;
  lng: number;
  zoom_level: number;
  poi_count: number;
}

type Props = {
  places: Place[];
  selectedCategories?: string[];
  className?: string;
  onMarkerClick?: (p: Place) => void;
  favorites?: string[];
  onToggleFavorite?: (placeId: string) => void;
  userTravellerCodes?: number[];
  cities?: City[];
  selectedCity?: City | null;
  onSelectCity?: (city: City) => void;
  onDeselectCity?: () => void;
};

export default function MapView({ places, selectedCategories = [], className, onMarkerClick, favorites = [], onToggleFavorite, userTravellerCodes = [], cities = [], selectedCity, onSelectCity, onDeselectCity }: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const isFirstLoadRef = useRef(true);
  const mapboxToken = 'pk.eyJ1IjoidGVvdGVvdGVvIiwiYSI6ImNtZjI5dHo1ajFwZW8ycnM3M3FhanR5dnUifQ.crUxO5_GUe8d5htizwYyOw';
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [placePhotos, setPlacePhotos] = useState<{ id: string; image_url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [selectedMapStyle, setSelectedMapStyle] = useState("cmi7jnne9000001sk04x0evzp");

  // Carica le risposte del traveller path
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
    if (savedAnswers) {
      try {
        setUserAnswers(JSON.parse(savedAnswers));
      } catch (err) {
        console.error("Errore caricamento risposte:", err);
      }
    }
  }, []);

  // Funzione per navigare tra i luoghi della stessa categoria
  const navigateCategory = (direction: 'prev' | 'next') => {
    if (!selectedPlace) return;
    
    // Filtra luoghi della stessa categoria
    const sameCategoryPlaces = filtered.filter(p => 
      normalizeCategory(p.category) === normalizeCategory(selectedPlace.category)
    );
    
    const currentIndex = sameCategoryPlaces.findIndex(p => p.id === selectedPlace.id);
    if (currentIndex === -1) return;
    
    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % sameCategoryPlaces.length;
    } else {
      nextIndex = currentIndex === 0 ? sameCategoryPlaces.length - 1 : currentIndex - 1;
    }
    
    setSelectedPlace(sameCategoryPlaces[nextIndex]);
    
    // Centra la mappa sul nuovo luogo
    if (mapRef.current && sameCategoryPlaces[nextIndex].lat && sameCategoryPlaces[nextIndex].lng) {
      mapRef.current.flyTo({
        center: [sameCategoryPlaces[nextIndex].lng!, sameCategoryPlaces[nextIndex].lat!],
        zoom: 15,
        duration: 1000
      });
    }
  };

  // Calcola info di navigazione
  const getCategoryNavInfo = () => {
    if (!selectedPlace) return null;
    
    const sameCategoryPlaces = filtered.filter(p => 
      normalizeCategory(p.category) === normalizeCategory(selectedPlace.category)
    );
    
    const currentIndex = sameCategoryPlaces.findIndex(p => p.id === selectedPlace.id);
    
    return {
      current: currentIndex + 1,
      total: sameCategoryPlaces.length,
      hasMultiple: sameCategoryPlaces.length > 1
    };
  };

  // Gestione swipe orizzontale
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      navigateCategory('next');
    }
    if (isRightSwipe) {
      navigateCategory('prev');
    }
  };

  // Carica le foto del luogo
  useEffect(() => {
    const loadPhotos = async () => {
      if (!selectedPlace?.id) {
        setPlacePhotos([]);
        return;
      }

      const { data, error } = await supabase
        .from('place_photos')
        .select('id, image_url')
        .eq('place_id', selectedPlace.id)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error loading photos:', error);
        return;
      }

      setPlacePhotos(data || []);
    };

    loadPhotos();
  }, [selectedPlace?.id]);

  // Upload foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedPlace) return;

    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPlace.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('place-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('place-photos')
        .getPublicUrl(fileName);

      // Save to database
      const { error: dbError } = await supabase
        .from('place_photos')
        .insert({
          place_id: selectedPlace.id,
          image_url: publicUrl,
          order_index: placePhotos.length
        });

      if (dbError) throw dbError;

      // Reload photos
      const { data } = await supabase
        .from('place_photos')
        .select('id, image_url')
        .eq('place_id', selectedPlace.id)
        .order('order_index', { ascending: true });

      setPlacePhotos(data || []);
      toast.success('Foto caricata!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Errore nel caricamento');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Delete foto
  const handleDeletePhoto = async (photoId: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/place-photos/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1].split('?')[0];
        
        // Delete from storage
        await supabase.storage
          .from('place-photos')
          .remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('place_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      setPlacePhotos(placePhotos.filter(p => p.id !== photoId));
      toast.success('Foto eliminata');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Errore nell\'eliminazione');
    }
  };

  // Funzione helper per validare le coordinate
  const isValidCoordinate = (lat?: number, lng?: number): boolean => {
    if (lat == null || lng == null) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  // Filtra solo published + categoria + coordinate valide
  const filtered = useMemo(() => {
    return places
      .filter(p => isValidCoordinate(p.lat, p.lng))
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
      style: `mapbox://styles/teoteoteo/${selectedMapStyle}`,
      center: [9.0852, 45.8081], // Como
      zoom: 12,
      pitch: 0,
      bearing: 0
    });

    // Zoom controls removed per user request
    
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [mapboxToken, selectedMapStyle]);

  // Ref per i marker delle città
  const cityMarkersRef = useRef<mapboxgl.Marker[]>([]);

  // Aggiungi marker ogni volta che cambia filtered
  useEffect(() => {
    if (!mapRef.current || !mapboxToken) return;
    const map = mapRef.current;

    // Rimuovi marker esistenti
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    
    // Rimuovi marker città esistenti
    cityMarkersRef.current.forEach(m => m.remove());
    cityMarkersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    // Aggiungi i "Big POI City" per le città non attive o non selezionate
    cities.forEach((city) => {
      // Mostra il Big POI solo se la città non è quella selezionata
      if (selectedCity && selectedCity.id === city.id) return;
      
      // Mostra il Big POI solo per città attive (ma non selezionate)
      if (!city.is_active) return;

      const el = document.createElement('div');
      el.className = 'big-poi-city-marker';
      el.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 1px 4px rgba(0, 159, 227, 0.3);
            border: 2px solid #009fe3;
          ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.41 113.39" style="width: 16px; height: 16px;">
              <polygon fill="#009fe3" points="41.29 81.98 41.01 85.2 32.72 85.2 32.72 64.16 32.2 64.16 32.55 60.94 36.02 60.94 36.02 81.98 41.29 81.98"/>
              <path fill="#009fe3" d="M45.62,64.03c-.12,0-.17.06-.17.17v17.75c0,.12.06.17.17.17h2.08c.12,0,.17-.06.17-.17v-17.75c0-.12-.06-.17-.17-.17h-2.08ZM51.16,82.12c0,.97-.3,1.75-.9,2.34-.6.59-1.39.88-2.36.88h-2.5c-.97,0-1.76-.29-2.36-.88-.6-.59-.9-1.37-.9-2.34v-18.09c0-.97.3-1.75.9-2.34.6-.59,1.39-.88,2.36-.88h2.5c.97,0,1.76.29,2.36.88.6.59.9,1.37.9,2.34v18.09h0Z"/>
              <path fill="#009fe3" d="M62.43,74.67v7.45c0,.97-.3,1.75-.9,2.34-.6.59-1.39.88-2.36.88h-2.5c-.97,0-1.76-.29-2.36-.88-.6-.59-.9-1.37-.9-2.34v-18.09c0-.97.3-1.75.9-2.34.6-.59,1.39-.88,2.36-.88h2.5c.97,0,1.76.29,2.36.88.6.59.9,1.37.9,2.34v7.76l-3.29-.35v-7.24c0-.12-.06-.17-.17-.17h-2.08c-.12,0-.17.06-.17.17v17.75c0,.12.06.17.17.17h2.08c.12,0,.17-.06.17-.17v-7.28h3.29Z"/>
              <path fill="#009fe3" d="M68.11,77.82h2.18l-1.07-12.06-1.11,12.06h0ZM67.45,85.2h-3.29l1.87-21.04h-.62l.35-3.22h6.34l2.15,24.26h-3.29l-.38-4.16h-2.74l-.38,4.16h0Z"/>
              <polygon fill="#009fe3" points="84.71 81.98 84.44 85.2 76.15 85.2 76.15 64.16 75.63 64.16 75.98 60.94 79.44 60.94 79.44 81.98 84.71 81.98"/>
              <polygon fill="#009fe3" points="34.17 34.15 34.21 55.2 30.15 55.52 30.1 34.46 23.32 34.99 23 30.94 48.54 28.96 48.86 33 34.17 34.15"/>
              <path fill="#009fe3" d="M42.1,43.13l5.57,1.11-5.56,3.12v-4.23h-.01ZM51.6,46.69l.04-5.8-13.61-2.72.04,16.74,4.06-.31v-2.59s2.61-1.47,2.61-1.47l4.78,4.82,2.88-2.86-3.99-4.02,3.18-1.79h0Z"/>
              <polygon fill="#009fe3" points="68.9 49.75 68.86 33.26 64.8 33.27 64.82 41.7 58.55 44.24 58.52 33.71 51.65 34.01 51.82 38.07 54.47 37.95 54.5 50.26 64.83 46.08 64.84 49.76 68.9 49.75"/>
              <polygon fill="#009fe3" points="54.43 52.86 55.26 56.83 63.7 55.06 62.87 51.09 54.43 52.86"/>
              <polygon fill="#009fe3" points="79.05 34.5 71.29 27.85 68.65 30.94 76.41 37.58 79.05 34.5"/>
              <path fill="#009fe3" d="M75.44,47.34c-.02-.13-.02-.26-.02-.39-.04-2.56,2-4.68,4.56-4.72,1.01-.02,1.95.29,2.72.83l-7.26,4.29h0ZM88.4,44.4c-.39-1.33-1.1-2.54-2.03-3.52-1.62-1.71-3.93-2.76-6.47-2.72-4.8.08-8.64,4.06-8.55,8.86.02.87.16,1.71.41,2.49l-6.17,3.65,2.07,3.5,6.21-3.67c1.61,1.64,3.86,2.63,6.34,2.59,3.89-.07,7.14-2.68,8.19-6.22l-4.35-.11c-.79,1.34-2.24,2.25-3.91,2.28-.94.02-1.82-.25-2.56-.72l7.11-4.2,3.71-2.19h0Z"/>
              <polygon fill="#009fe3" points="57.01 30.22 55.38 26.5 51.67 28.13 53.29 31.84 57.01 30.22"/>
            </svg>
          </div>
          <div style="
            margin-top: 2px;
            background: white;
            padding: 1px 4px;
            border-radius: 4px;
            font-size: 8px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            color: #009fe3;
            text-transform: uppercase;
          ">
            ${city.name}
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([city.lng, city.lat]);

      // Click handler - assegnato direttamente all'elemento
      el.onclick = (e) => {
        e.stopPropagation();
        console.log('BPC CLICKED:', city.name);
        
        // Zoom sulla città
        map.flyTo({
          center: [city.lng, city.lat],
          zoom: 12,
          duration: 1200
        });
        
        // Seleziona la città
        if (onSelectCity) {
          onSelectCity(city);
        }
      };
      
      // Stile pointer
      el.style.cursor = 'pointer';
      el.style.pointerEvents = 'auto';

      marker.addTo(map);
      cityMarkersRef.current.push(marker);
      
      bounds.extend([city.lng, city.lat]);
    });

    // Aggiungi marker normali per i POI solo se una città è selezionata
    // Quando nessuna città è selezionata, mostra solo i Big POI City
    if (selectedCity) {
      filtered.forEach((p, index) => {
      const emoji = categoryEmoji(p.category);
      
      // Controlla se il POI è compatibile con il traveller path dell'utente
      const isCompatible = userTravellerCodes.length > 0 && p.tp_codes && p.tp_codes.length > 0 
        ? p.tp_codes.some(code => userTravellerCodes.includes(code))
        : false;
      
      // Crea elemento marker senza animazione
      const el = document.createElement('div');
      el.innerHTML = `
        <div style="
          width:24px;height:24px;border-radius:999px;
          background:#fff; display:flex;align-items:center;justify-content:center;
          box-shadow:${isCompatible ? '0 0 20px 4px rgba(59, 130, 246, 0.8), 0 0 40px 8px rgba(59, 130, 246, 0.5), 0 0 60px 12px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,.3)' : '0 2px 8px rgba(0,0,0,.3), 0 0 20px rgba(59, 130, 246, 0.3)'}; 
          border:${isCompatible ? '3px solid #3b82f6' : '1px solid rgba(0,0,0,.1)'};
          cursor: pointer;
        ">
          <div style="font-size:14px;line-height:14px">${emoji}</div>
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
    }

    // Fit bounds se ci sono markers
    if (selectedCity && filtered.length > 0) {
      // Città selezionata: zoom sui POI filtrati
      map.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    } else if (!selectedCity && cityMarkersRef.current.length > 0) {
      // Nessuna città selezionata: zoom sui Big POI City
      map.fitBounds(bounds, { padding: 80, maxZoom: 8 });
    }
    
    // Disabilita l'animazione dopo il primo caricamento
    if (isFirstLoadRef.current) {
      setTimeout(() => {
        isFirstLoadRef.current = false;
      }, 500);
    }
  }, [filtered, onMarkerClick, favorites, onToggleFavorite, userTravellerCodes, mapboxToken, cities, selectedCity, onSelectCity]);

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

  // Funzione per selezionare un luogo
  const handleSelectPlace = (place: Place) => {
    if (!mapRef.current) return;
    
    // Centra la mappa sul luogo selezionato
    mapRef.current.flyTo({
      center: [place.lng!, place.lat!],
      zoom: 15,
      duration: 1500
    });
    
    // Apri il drawer del luogo
    setSelectedPlace(place);
    setSearchOpen(false);
    setSearchQuery("");
  };

  // Filtra i luoghi per la ricerca
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description?.toLowerCase().includes(query) ||
      p.address?.toLowerCase().includes(query) ||
      p.city?.toLowerCase().includes(query) ||
      normalizeCategory(p.category).toLowerCase().includes(query)
    );
  }, [searchQuery, filtered]);

  // Trova la connessione TP per il luogo selezionato
  const getTpConnection = () => {
    if (!selectedPlace || !selectedPlace.tp_codes || selectedPlace.tp_codes.length === 0) {
      return null;
    }

    // Mappa dei codici alle domande del Traveller Path
    const codeToQuestionMap: Record<number, { question: string; label: string }> = {
      1: { question: "Profilo", label: "Local" },
      2: { question: "Profilo", label: "Traveler" },
      10: { question: "Genere", label: "Maschio" },
      11: { question: "Genere", label: "Femmina" },
      12: { question: "Genere", label: "Altro" },
      20: { question: "Età", label: "<18" },
      21: { question: "Età", label: "18–24" },
      22: { question: "Età", label: "25–34" },
      23: { question: "Età", label: "35–49" },
      24: { question: "Età", label: "50–64" },
      25: { question: "Età", label: ">65" },
      30: { question: "Inclinazione", label: "Avventura" },
      31: { question: "Inclinazione", label: "Relax" },
      32: { question: "Inclinazione", label: "Cultura" },
      33: { question: "Inclinazione", label: "Shopping" },
      34: { question: "Inclinazione", label: "Nightlife" },
      35: { question: "Inclinazione", label: "Socializing" },
      90: { question: "Nazionalità", label: "Europa" },
      91: { question: "Nazionalità", label: "USA" },
      92: { question: "Nazionalità", label: "Sud America" },
      93: { question: "Nazionalità", label: "Asia" },
      94: { question: "Nazionalità", label: "Africa" },
      95: { question: "Nazionalità", label: "Middle East" },
      110: { question: "Composizione", label: "Solo" },
      111: { question: "Composizione", label: "Coppia" },
      112: { question: "Composizione", label: "Gruppo" },
      113: { question: "Composizione", label: "Famiglia" },
      120: { question: "Budget", label: "Low" },
      121: { question: "Budget", label: "Medium" },
      122: { question: "Budget", label: "Premium" },
    };

    // Trova i codici che corrispondono tra il luogo e l'utente
    const matchingCodes = selectedPlace.tp_codes.filter(code => 
      userTravellerCodes.includes(code)
    );

    if (matchingCodes.length === 0) return null;

    // Prendi il primo codice corrispondente
    const matchingCode = matchingCodes[0];
    const connection = codeToQuestionMap[matchingCode];

    if (!connection) return null;

    return {
      question: connection.question,
      answer: connection.label
    };
  };

  return (
    <>
      <div className={className ?? "relative h-[70vh] w-full"}>
        {/* Search Bar */}
        <div className={`absolute top-4 z-20 w-full max-w-sm px-4 ${selectedCity ? 'left-1/2 -translate-x-1/2 sm:left-auto sm:right-16 sm:translate-x-0' : 'left-1/2 -translate-x-1/2'}`}>

        {/* City Indicator Badge - below search bar */}
        {selectedCity && onDeselectCity && (
          <div className="absolute top-20 left-4 z-10">
            <button
              onClick={onDeselectCity}
              className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all active:scale-95 border-2 border-[#009fe3]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 111.41 113.39" className="w-6 h-6">
                <polygon fill="#009fe3" points="41.29 81.98 41.01 85.2 32.72 85.2 32.72 64.16 32.2 64.16 32.55 60.94 36.02 60.94 36.02 81.98 41.29 81.98"/>
                <path fill="#009fe3" d="M45.62,64.03c-.12,0-.17.06-.17.17v17.75c0,.12.06.17.17.17h2.08c.12,0,.17-.06.17-.17v-17.75c0-.12-.06-.17-.17-.17h-2.08ZM51.16,82.12c0,.97-.3,1.75-.9,2.34-.6.59-1.39.88-2.36.88h-2.5c-.97,0-1.76-.29-2.36-.88-.6-.59-.9-1.37-.9-2.34v-18.09c0-.97.3-1.75.9-2.34.6-.59,1.39-.88,2.36-.88h2.5c.97,0,1.76.29,2.36.88.6.59.9,1.37.9,2.34v18.09h0Z"/>
                <path fill="#009fe3" d="M62.43,74.67v7.45c0,.97-.3,1.75-.9,2.34-.6.59-1.39.88-2.36.88h-2.5c-.97,0-1.76-.29-2.36-.88-.6-.59-.9-1.37-.9-2.34v-18.09c0-.97.3-1.75.9-2.34.6-.59,1.39-.88-2.36-.88h2.5c.97,0,1.76.29,2.36.88.6.59.9,1.37.9,2.34v7.76l-3.29-.35v-7.24c0-.12-.06-.17-.17-.17h-2.08c-.12,0-.17.06-.17.17v17.75c0,.12.06.17.17.17h2.08c.12,0,.17-.06.17-.17v-7.28h3.29Z"/>
                <path fill="#009fe3" d="M68.11,77.82h2.18l-1.07-12.06-1.11,12.06h0ZM67.45,85.2h-3.29l1.87-21.04h-.62l.35-3.22h6.34l2.15,24.26h-3.29l-.38-4.16h-2.74l-.38,4.16h0Z"/>
                <polygon fill="#009fe3" points="84.71 81.98 84.44 85.2 76.15 85.2 76.15 64.16 75.63 64.16 75.98 60.94 79.44 60.94 79.44 81.98 84.71 81.98"/>
                <polygon fill="#009fe3" points="34.17 34.15 34.21 55.2 30.15 55.52 30.1 34.46 23.32 34.99 23 30.94 48.54 28.96 48.86 33 34.17 34.15"/>
                <path fill="#009fe3" d="M42.1,43.13l5.57,1.11-5.56,3.12v-4.23h-.01ZM51.6,46.69l.04-5.8-13.61-2.72.04,16.74,4.06-.31v-2.59s2.61-1.47,2.61-1.47l4.78,4.82,2.88-2.86-3.99-4.02,3.18-1.79h0Z"/>
                <polygon fill="#009fe3" points="68.9 49.75 68.86 33.26 64.8 33.27 64.82 41.7 58.55 44.24 58.52 33.71 51.65 34.01 51.82 38.07 54.47 37.95 54.5 50.26 64.83 46.08 64.84 49.76 68.9 49.75"/>
                <polygon fill="#009fe3" points="54.43 52.86 55.26 56.83 63.7 55.06 62.87 51.09 54.43 52.86"/>
                <polygon fill="#009fe3" points="79.05 34.5 71.29 27.85 68.65 30.94 76.41 37.58 79.05 34.5"/>
                <path fill="#009fe3" d="M75.44,47.34c-.02-.13-.02-.26-.02-.39-.04-2.56,2-4.68,4.56-4.72,1.01-.02,1.95.29,2.72.83l-7.26,4.29h0ZM88.4,44.4c-.39-1.33-1.1-2.54-2.03-3.52-1.62-1.71-3.93-2.76-6.47-2.72-4.8.08-8.64,4.06-8.55,8.86.02.87.16,1.71.41,2.49l-6.17,3.65,2.07,3.5,6.21-3.67c1.61,1.64,3.86,2.63,6.34,2.59,3.89-.07,7.14-2.68,8.19-6.22l-4.35-.11c-.79,1.34-2.24,2.25-3.91,2.28-.94.02-1.82-.25-2.56-.72l7.11-4.2,3.71-2.19h0Z"/>
                <polygon fill="#009fe3" points="57.01 30.22 55.38 26.5 51.67 28.13 53.29 31.84 57.01 30.22"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </div>
            </button>
          </div>
        )}
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-full justify-between bg-background/95 backdrop-blur-sm shadow-lg h-9 text-sm hover:bg-primary/10 border-primary/20"
                onClick={() => setSearchOpen(true)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Search className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span className="truncate text-muted-foreground">
                    {searchQuery || "Cerca luoghi..."}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Cerca luoghi..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
                <CommandList>
                  <CommandEmpty>Se non c'è, suggeriscilo 💡</CommandEmpty>
                  <CommandGroup>
                    {searchResults.slice(0, 10).map((place) => (
                      <CommandItem
                        key={place.id}
                        value={place.name}
                        onSelect={() => handleSelectPlace(place)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">{categoryEmoji(place.category)}</span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium truncate">{place.name}</span>
                          <span className="text-xs text-muted-foreground truncate">
                            {normalizeCategory(place.category)}
                            {place.city && ` • ${place.city}`}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>


        <style>{`
          /* Big POI City marker */
          .big-poi-city-marker .big-poi-inner:hover > div:first-child {
            transform: scale(1.1);
          }
          
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
        <div ref={containerRef} className="absolute inset-0 w-full h-full rounded-2xl border" />
      </div>
      
      <Drawer open={!!selectedPlace} onOpenChange={(open) => !open && setSelectedPlace(null)}>
        <DrawerContent 
          className="max-w-5xl mx-auto"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <DrawerHeader className="px-4 pb-2">
            {getCategoryNavInfo()?.hasMultiple && (
              <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <span className="text-xs text-muted-foreground">
                  {getCategoryNavInfo()?.current} di {getCategoryNavInfo()?.total} in {normalizeCategory(selectedPlace?.category || '')}
                </span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateCategory('prev')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateCategory('next')}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0 mt-1">{categoryEmoji(selectedPlace?.category || '')}</span>
              <div className="flex-1 min-w-0">
                <DrawerTitle className="text-lg mb-1">{selectedPlace?.name}</DrawerTitle>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{normalizeCategory(selectedPlace?.category || '')}</p>
              </div>
            </div>
          </DrawerHeader>
          
          <div className="px-4 pb-6 space-y-3">
            {selectedPlace?.description && (
              <p className="text-sm text-muted-foreground">
                <LinkifiedText text={selectedPlace.description} />
              </p>
            )}
            
            {selectedPlace?.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>📍</span> {selectedPlace.address}
              </p>
            )}

            {/* TP Connection */}
            {(() => {
              const tpConnection = getTpConnection();
              if (tpConnection) {
                return (
                  <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        ✨ TP Connection
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{tpConnection.question}:</span>{' '}
                      <span className="text-muted-foreground">{tpConnection.answer}</span>
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* Photo Gallery */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Galleria foto</h4>
              
              {placePhotos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {placePhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="relative aspect-square group cursor-pointer"
                      onClick={() => setEnlargedPhoto(photo.image_url)}
                    >
                      <img
                        src={photo.image_url}
                        alt="Place photo"
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id, photo.image_url);
                        }}
                        className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onToggleFavorite && selectedPlace) {
                    onToggleFavorite(selectedPlace.id);
                  }
                }}
                className="w-full touch-manipulation active:scale-95 transition-transform min-h-[44px]"
              >
                <Heart className={`h-5 w-5 ${favorites.includes(selectedPlace?.id || '') ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedPlace) {
                    window.location.href = `/luogo/${selectedPlace.slug}`;
                  }
                }}
                className="w-full"
              >
                Pagina luogo
              </Button>
              
              <Button
                onClick={() => {
                  if (selectedPlace) {
                    const query = encodeURIComponent(
                      selectedPlace.name + ' ' + (selectedPlace.address || selectedPlace.city || '')
                    );
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  }
                }}
                className="w-full bg-black text-white hover:bg-black/90 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Maps
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={!!enlargedPhoto} onOpenChange={() => setEnlargedPhoto(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-background/95">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img
              src={enlargedPhoto || ""}
              alt="Enlarged"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* Escape utili (per testo, NON per le immagini) */
function escapeHtml(s?: string) {
  return (s ?? "").replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!)
  );
}
