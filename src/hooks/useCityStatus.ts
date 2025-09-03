import { useState, useEffect } from 'react';
import { CityStatus } from '@/types/city';

const STORAGE_KEY = 'cityStatus';

export function useCityStatus() {
  const [cityStatus, setCityStatus] = useState<Record<string, CityStatus>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCityStatus(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing city status:', e);
      }
    }
  }, []);

  const updateCityStatus = (cityId: string, status: CityStatus) => {
    const newStatus = { ...cityStatus, [cityId]: status };
    setCityStatus(newStatus);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStatus));
  };

  const getCityStatus = (cityId: string): CityStatus => {
    return cityStatus[cityId] || 'normal';
  };

  const getWishlistCities = () => {
    return Object.entries(cityStatus).filter(([_, status]) => status === 'wishlist').map(([id]) => id);
  };

  const getVisitedCities = () => {
    return Object.entries(cityStatus).filter(([_, status]) => status === 'visited').map(([id]) => id);
  };

  return {
    getCityStatus,
    updateCityStatus,
    getWishlistCities,
    getVisitedCities
  };
}