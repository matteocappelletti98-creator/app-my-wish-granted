import React from 'react';
import { CITIES } from '@/types/city';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCitySelect: (cityId: string) => void;
};

export default function CitySelector({ isOpen, onClose, onCitySelect }: Props) {
  if (!isOpen) return null;

  const sortedCities = Object.values(CITIES).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Seleziona Città</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {sortedCities.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onCitySelect(city.id);
                  onClose();
                }}
                className="text-left p-3 rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="font-medium">{city.name}</div>
                {city.status === 'pending' && (
                  <div className="text-xs text-red-600">In approvazione</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}