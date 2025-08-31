import { useEffect, useState } from "react";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import { Link } from "react-router-dom";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Index() {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    fetchPlacesFromSheet(CSV_URL).then(data => {
      // prendi solo i published, ultimi 3
      const published = data.filter(p => p.status === "published");
      setPlaces(published.slice(-3).reverse());
    });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Benvenuto nella tua app!</h1>
      <p className="text-gray-600">Ecco gli ultimi luoghi pubblicati:</p>

      <div className="grid gap-4 md:grid-cols-3">
        {places.map((p, i) => (
          <div key={i} className="border rounded-xl p-4 shadow-sm space-y-2 bg-white">
            {/* icona (qui uso 🌍, ma puoi sostituire con una vera icona lucide-react) */}
            <div className="text-3xl">🌍</div>
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500">{p.city}, {p.country}</p>
            <Link to="/places" className="text-blue-600 text-sm underline">
              Vedi tutti i luoghi →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}