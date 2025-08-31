import { useEffect, useState } from "react";

const CSV_URL = https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/edit?resourcekey=&gid=2050593337#gid=2050593337;

interface Place {
  name: string;
  city: string;
  country: string;
  description: string;
  image?: string;
  status: string;
}

function parseCSV(csv: string): Place[] {
  const [headerLine, ...lines] = csv.trim().split("\n");
  const headers = headerLine.split(",").map(h => h.trim().toLowerCase());
  return lines.map(line => {
    const values = line.split(",");
    const entry: any = {};
    headers.forEach((h, i) => (entry[h] = values[i]));
    return {
      name: entry["nome del luogo"],
      city: entry["città"],
      country: entry["paese"],
      description: entry["descrizione"],
      image: entry["immagine (url opzionale)"],
      status: entry["status"],
    } as Place;
  });
}

export default function App() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(CSV_URL)
      .then(res => res.text())
      .then(text => {
        const data = parseCSV(text);
        setPlaces(data.filter(p => p.status === "published"));
      });
  }, []);

  const filtered = places.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Luoghi pubblicati</h1>
      <input
        type="text"
        placeholder="Cerca per nome o città..."
        className="border p-2 rounded w-full"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {filtered.map((p, idx) => (
        <div key={idx} className="border rounded-lg p-4 shadow space-y-2">
          <h2 className="text-lg font-semibold">{p.name}</h2>
          <p className="text-sm text-gray-500">
            {p.city}, {p.country}
          </p>
          <p>{p.description}</p>
          {p.image && (
            <img
              src={p.image}
              alt={p.name}
              className="w-full rounded-lg mt-2"
            />
          )}
        </div>
      ))}
      {filtered.length === 0 && (
        <p className="text-gray-500">Nessun luogo trovato.</p>
      )}
    </div>
  );
}
