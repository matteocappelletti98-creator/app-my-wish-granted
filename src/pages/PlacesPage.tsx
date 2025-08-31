
import { useEffect, useState } from "react";

interface Place {
  id: string;
  name: string;
  city: string;
  country: string;
  description: string;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_DIRECTUS_URL}/items/places?filter[status][_eq]=published`
      );
      const data = await res.json();
      setPlaces(data.data);
      setLoading(false);
    };
    fetchPlaces();
  }, []);

  if (loading) return <p className="p-4">Caricamento...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Luoghi</h1>
      {places.map((place) => (
        <div key={place.id} className="rounded-xl border p-4 shadow-sm">
          <h2 className="text-lg font-semibold">{place.name}</h2>
          <p className="text-sm text-gray-600">
            {place.city}, {place.country}
          </p>
          <p className="text-gray-700 mt-2">{place.description}</p>
        </div>
      ))}
    </div>
  );
}
