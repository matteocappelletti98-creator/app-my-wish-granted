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
            <option value="losangeles">Los Angeles</option>
            <option value="lasvegas">Las Vegas</option>
            <option value="orlando">Orlando</option>
            <option value="miami">Miami</option>
            <option value="sanfrancisco">San Francisco</option>
            <option value="washington">Washington</option>
            <option value="honolulu">Honolulu</option>
            <option value="toronto">Toronto</option>
            <option value="vancouver">Vancouver</option>
            <option value="montreal">Montréal</option>
            <option value="cittadelmessico">Città del Messico</option>
            <option value="cancun">Cancún</option>
            <option value="puntacana">Punta Cana</option>
            <option value="buenosaires">Buenos Aires</option>
            <option value="santiago">Santiago</option>
            <option value="bogota">Bogotá</option>
            <option value="riodejaneiro">Rio de Janeiro</option>
            <option value="saopaulo">San Paolo</option>
            <option value="lima">Lima</option>
            <option value="sydney">Sydney</option>
            <option value="melbourne">Melbourne</option>
            <option value="perth">Perth</option>
            <option value="brisbane">Brisbane</option>
            <option value="tokyo">Tokyo</option>
            <option value="osaka">Osaka</option>
            <option value="kyoto">Kyoto</option>
            <option value="fukuoka">Fukuoka</option>
            <option value="sapporo">Sapporo</option>
            <option value="pechino">Pechino</option>
            <option value="shanghai">Shanghai</option>
            <option value="guangzhou">Guangzhou</option>
            <option value="shenzhen">Shenzhen</option>
            <option value="zhuhai">Zhuhai</option>
            <option value="macao">Macao</option>
            <option value="hongkong">Hong Kong</option>
            <option value="singapore">Singapore</option>
            <option value="phuket">Phuket</option>
            <option value="pattaya">Pattaya-Chonburi</option>
            <option value="kualalumpur">Kuala Lumpur</option>
            <option value="nizza">Nizza</option>
            <option value="marsiglia">Marsiglia</option>
            <option value="lione">Lione</option>
            <option value="marnelavalee">Marne-la-Vallée</option>
            <option value="madrid">Madrid</option>
            <option value="siviglia">Siviglia</option>
            <option value="valencia">Valencia</option>
            <option value="palmadimallorca">Palma di Mallorca</option>
            <option value="firenze">Firenze</option>
            <option value="venezia">Venezia</option>
            <option value="napoli">Napoli</option>
            <option value="bologna">Bologna</option>
            <option value="verona">Verona</option>
            <option value="londra">Londra</option>
            <option value="edimburgo">Edimburgo</option>
            <option value="monaco">Monaco di Baviera</option>
            <option value="francoforte">Francoforte sul Meno</option>
            <option value="amburgo">Amburgo</option>
            <option value="vienna">Vienna</option>
            <option value="salisburgo">Salisburgo</option>
            <option value="amsterdam">Amsterdam</option>
            <option value="rotterdam">Rotterdam</option>
            <option value="bruxelles">Bruxelles</option>
            <option value="bruges">Bruges</option>
            <option value="zurigo">Zurigo</option>
            <option value="ginevra">Ginevra</option>
            <option value="copenaghen">Copenaghen</option>
            <option value="stoccolma">Stoccolma</option>
            <option value="helsinki">Helsinki</option>
            <option value="varsavia">Varsavia</option>
            <option value="cracovia">Cracovia</option>
            <option value="atene">Atene</option>
            <option value="heraklion">Heraklion</option>
            <option value="rodi">Rodi</option>
            <option value="salonicco">Salonicco</option>
            <option value="budapest">Budapest</option>
            <option value="riga">Riga</option>
            <option value="vilnius">Vilnius</option>
            <option value="tallinn">Tallinn</option>
            <option value="mosca">Mosca</option>
            <option value="sanpietroburgo">San Pietroburgo</option>
            <option value="tbilisi">Tbilisi</option>
            <option value="ilcairo">Il Cairo</option>
            <option value="marrakech">Marrakech</option>
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
