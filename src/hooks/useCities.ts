import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  lat: number;
  lng: number;
  zoom_level: number;
  poi_count: number;
}

export function useCities() {
  const [cities, setCities] = useState<City[]>([]);
  const [activeCities, setActiveCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasUserDeselected, setHasUserDeselected] = useState(false); // Track if user manually deselected

  // Carica le città dal database
  const loadCities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');

      if (error) throw error;

      const allCities = (data as City[]) || [];
      setCities(allCities);
      setActiveCities(allCities.filter(c => c.is_active));

      // Auto-seleziona Como all'apertura se non c'è già una città selezionata
      if (!selectedCity && !hasUserDeselected) {
        const comoCity = allCities.find(c => c.name.toLowerCase() === 'como' && c.is_active);
        if (comoCity) {
          setSelectedCity(comoCity);
        }
      }
    } catch (error) {
      console.error('Errore caricamento città:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, hasUserDeselected]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // Seleziona una città (espande i suoi POI)
  const selectCity = useCallback((city: City) => {
    setSelectedCity(city);
    setHasUserDeselected(false); // Reset when user selects a city
  }, []);

  // Deseleziona la città corrente
  const deselectCity = useCallback(() => {
    setSelectedCity(null);
    setHasUserDeselected(true); // Mark that user manually deselected
  }, []);

  // Controlla se un luogo appartiene alla città selezionata
  const isPlaceInSelectedCity = useCallback((placeCity: string) => {
    // Se nessuna città selezionata o ancora in caricamento, mostra tutto
    if (!selectedCity || loading) return true;
    
    // Se non ci sono città attive, mostra tutto
    if (activeCities.length === 0) return true;
    
    // Matching flessibile: controlla se il nome della città è contenuto
    const placeCityLower = placeCity.toLowerCase().trim();
    const selectedCityLower = selectedCity.name.toLowerCase().trim();
    
    return placeCityLower.includes(selectedCityLower) ||
           selectedCityLower.includes(placeCityLower) ||
           placeCityLower === selectedCityLower;
  }, [selectedCity, loading, activeCities]);

  return {
    cities,
    activeCities,
    selectedCity,
    loading,
    selectCity,
    deselectCity,
    isPlaceInSelectedCity,
    refreshCities: loadCities
  };
}
