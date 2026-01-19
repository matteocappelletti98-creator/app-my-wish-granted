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

      // Se nessuna città è selezionata, seleziona la prima attiva
      if (!selectedCity) {
        const defaultCity = allCities.find(c => c.is_active);
        if (defaultCity) {
          setSelectedCity(defaultCity);
        }
      }
    } catch (error) {
      console.error('Errore caricamento città:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    loadCities();
  }, [loadCities]);

  // Seleziona una città (espande i suoi POI)
  const selectCity = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  // Deseleziona la città corrente
  const deselectCity = useCallback(() => {
    setSelectedCity(null);
  }, []);

  // Controlla se un luogo appartiene alla città selezionata
  const isPlaceInSelectedCity = useCallback((placeCity: string) => {
    if (!selectedCity) return true; // Se nessuna città selezionata, mostra tutto
    return placeCity.toLowerCase().includes(selectedCity.name.toLowerCase()) ||
           selectedCity.name.toLowerCase().includes(placeCity.toLowerCase());
  }, [selectedCity]);

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
