import { useMemo, useState } from "react";
import MapPicker from "@/components/MapPicker";
import { buildFormUrl } from "@/config";

export default function AddPlace() {
  // coordinate scelte cliccando sulla mappa
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();

  // contesto: se stai inserendo per la Home o per my.explore
  const [source, setSource] = useState<string>("home"); // "home" | "my_explore"
  
  // città di riferimento
  const [selectedCity, setSelectedCity] = useState<string>("como");

  // URL del Google Form precompilato con le coordinate scelte
  const formUrl = useMemo(() => buildFormUrl(lat, lng, source), [lat, lng, source]);

  const openFormInNewTab = () => {
    const url = formUrl.replace("&embedded=true", ""); // link “pulito” fuori da iframe
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inserisci un nuovo luogo</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scelta del contesto */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Contesto di inserimento</label>
          <select
            className="border p-2 rounded w-full"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="home">Home</option>
            <option value="my_explore">my.explore</option>
          </select>
          <p className="text-xs text-gray-500">
            Serve per sapere da dove proviene il POI.
          </p>
        </div>

        {/* Scelta della città */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700">Città di riferimento</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="como">Como</option>
            <option value="newyork">New York</option>
            <option value="bangkok">Bangkok</option>
            <option value="parigi">Parigi</option>
            <option value="roma">Roma</option>
            <option value="milano">Milano</option>
            <option value="berlino">Berlino</option>
            <option value="barcellona">Barcellona</option>
          </select>
          <p className="text-xs text-gray-500">
            Puoi inserire POI in un raggio di 50km dalla città scelta.
          </p>
        </div>
      </div>

      {/* Mappa cliccabile: scegli le coordinate */}
      <div className="space-y-3">
        <p className="text-gray-700">
          Clicca sulla mappa per selezionare le coordinate del nuovo POI.
        </p>
        <MapPicker
          selectedCity={selectedCity}
          onPick={({ lat, lng }) => {
            setLat(lat);
            setLng(lng);
          }}
        />
        <div className="text-sm text-gray-600">
          Coordinate selezionate:{" "}
          <b>{lat != null ? lat.toFixed(6) : "—"}</b>,{" "}
          <b>{lng != null ? lng.toFixed(6) : "—"}</b>
        </div>
      </div>

      {/* Form incorporato (si aggiorna con le coordinate) */}
      <div className="border rounded-xl overflow-hidden">
        <iframe
          key={formUrl} // forza il reload quando cambia
          src={formUrl}
          width="100%"
          height="900"
          style={{ border: 0 }}
          title="Form Inserimento Luogo"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={openFormInNewTab}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          Apri il modulo in una nuova scheda
        </button>
        <span className="text-sm text-gray-500 self-center">
          (Apri in nuova scheda se preferisci compilare il Form a schermo intero)
        </span>
      </div>

      <div className="text-xs text-gray-500">
        Suggerimento: nel Google Form ricordati di impostare il campo <code>status</code> ={" "}
        <b>published</b> per far apparire il POI nella mappa.
      </div>
    </div>
  );
}
