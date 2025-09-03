import React from 'react';
import { City, CityStatus } from '@/types/city';

type Props = {
  city: City;
  position: { x: number; y: number };
  onAction: (action: 'zoom' | 'wishlist' | 'visited') => void;
  onClose: () => void;
};

export default function CityBanner({ city, position, onAction, onClose }: Props) {
  if (city.status === 'pending') {
    return (
      <div 
        className="absolute z-[9998] bg-white rounded-lg shadow-xl border p-4 min-w-64"
        style={{ 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -100%) translateY(-10px)'
        }}
      >
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
        <div className="text-center">
          <h3 className="font-semibold text-red-600 mb-2">{city.name}</h3>
          <p className="text-sm text-gray-600">
            Città in fase di approvazione editoriale, stiamo lavorando per voi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute z-[9998] bg-white rounded-lg shadow-xl border p-4 min-w-64"
      style={{ 
        left: position.x, 
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-10px)'
      }}
    >
      <button 
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        ✖
      </button>
      <h3 className="font-semibold mb-3">{city.name}</h3>
      <div className="space-y-2">
        <button
          onClick={() => onAction('zoom')}
          className="w-full p-2 text-left rounded-md bg-blue-50 hover:bg-blue-100 border border-blue-200"
        >
          🗺️ Vai a {city.name}
        </button>
        <button
          onClick={() => onAction('wishlist')}
          className="w-full p-2 text-left rounded-md bg-green-50 hover:bg-green-100 border border-green-200"
        >
          💚 Da visitare
        </button>
        <button
          onClick={() => onAction('visited')}
          className="w-full p-2 text-left rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200"
        >
          🏁 Visitata
        </button>
      </div>
    </div>
  );
}