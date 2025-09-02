// URL del CSV pubblicato della Home
export const HOME_CSV_URL =
 export const HOME_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

// URL del CSV pubblicato della sezione "my.explore"
export const MY_CSV_URL =
  "https://docs.google.com/spreadsheets/d/ID_DEL_FOGLIO_MY/export?format=csv&gid=0";

// Configurazione del Google Form per l'inserimento dei POI
export const GOOGLE_FORM = {
  baseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfTDxGRpDNG1JdSwD-fGUgSe3XrT9mO8wE_J-8ISsFhLz2P_g/viewform",
  embedded: true,
  entries: {
    lat: "entry.1163510933",     // ID del campo Latitudine
    lng: "entry.962407757",     // ID del campo Longitudine
    source: "entry.333333333",  // (opzionale) ID del campo Contesto
  },
};
// https://docs.google.com/forms/d/e/1FAIpQLSfTDxGRpDNG1JdSwD-fGUgSe3XrT9mO8wE_J-8ISsFhLz2P_g/viewform?usp=pp_url&entry.1163510933=45.4642&entry.962407757=9.1900
// Funzione che costruisce l'URL del form precompilato
export function buildFormUrl(lat?: number, lng?: number, source?: string) {
  const params = new URLSearchParams();
  if (lat != null) params.set(GOOGLE_FORM.entries.lat, String(lat));
  if (lng != null) params.set(GOOGLE_FORM.entries.lng, String(lng));
  if (source) params.set(GOOGLE_FORM.entries.source, source);

  const base = GOOGLE_FORM.baseUrl.replace("/viewform", "/viewform");
  return `${base}?${params.toString()}${GOOGLE_FORM.embedded ? "&embedded=true" : ""}`;
}
