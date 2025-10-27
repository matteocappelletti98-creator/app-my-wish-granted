// src/lib/sheet.ts
import { normalizeCategory } from "@/components/CategoryIcon";

export type Place = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  description: string;
  image?: string;
  status: string;
  category?: string;
  address?: string;
  lat?: number;
  lng?: number;
  tp_codes?: number[];
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"') { if (inQuotes && next === '"') { cell += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === "," && !inQuotes) { row.push(cell); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (cell.length || row.length) { row.push(cell); rows.push(row); row = []; cell = ""; }
      if (ch === "\r" && next === "\n") i++;
    } else { cell += ch; }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function normHeader(h: string) {
  const key = h.trim().toLowerCase();
  const map: Record<string, string> = {
    "id":"id","poi_id":"id",
    "nome del luogo":"name","name":"name",
    "città":"city","city":"city",
    "paese":"country","country":"country",
    "descrizione":"description","description":"description",
    "immagine (url opzionale)":"image","image":"image","image_url":"image",
    "status":"status",
    "categoria":"category","category":"category",
    "indirizzo":"address","address":"address","via":"address","strada":"address",
    "lat":"lat","latitude":"lat","latitudine":"lat",
    "lng":"lng","long":"lng","lon":"lng","longitude":"lng","longitudine":"lng",
    "tp_codes":"tp_codes",
  };
  return map[key] || key;
}

function toSlug(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,80);
}

export function normalizeImagePath(imagePath: string): string {
  if (!imagePath || imagePath === "z") return "";
  
  let normalized = imagePath;
  // Remove "public/" prefix if present
  if (normalized.startsWith("public/")) {
    normalized = normalized.substring(7);
  }
  // Remove "./" prefix if present
  if (normalized.startsWith("./")) {
    normalized = normalized.substring(2);
  }
  // Add "/" prefix if not present
  if (!normalized.startsWith("/")) {
    normalized = "/" + normalized;
  }
  return normalized;
}

export async function fetchPlacesFromSheet(csvUrl: string): Promise<Place[]> {
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error("Impossibile leggere il CSV del foglio");
    const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normHeader);
  console.log("Headers mappati:", headers);

  const out: Place[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]; const rec: any = {};
    headers.forEach((h, idx) => rec[h] = (r[idx] ?? "").trim());
    const name = rec.name || ""; const city = rec.city || ""; 
    
    // Usa l'ID dal foglio se disponibile, altrimenti genera uno slug
    const id = rec.id || toSlug(`${name}-${city}`) || `row-${i}`;
    const slug = toSlug(`${name}-${city}`) || id;

    // Pulisci e valida le coordinate - rimuovi caratteri non numerici eccetto punto e segno negativo
    const cleanLat = rec.lat ? rec.lat.replace(/[^\d.-]/g, '') : '';
    const cleanLng = rec.lng ? rec.lng.replace(/[^\d.-]/g, '') : '';
    
    const lat = cleanLat ? Number(cleanLat) : undefined;
    const lng = cleanLng ? Number(cleanLng) : undefined;

    console.log(`Parsing ${name}: lat=${rec.lat} -> ${lat}, lng=${rec.lng} -> ${lng}`);

    // Normalize image path
    const imagePath = normalizeImagePath(rec.image || "");

    // Parse tp_codes
    const tpCodes = rec.tp_codes 
      ? rec.tp_codes.split(',').map((code: string) => parseInt(code.trim())).filter((code: number) => !isNaN(code))
      : [];

    const originalCategory = rec.category || "";
    const normalizedCategory = normalizeCategory(originalCategory);
    
    if (originalCategory && normalizedCategory === "other") {
      console.log(`⚠️ Categoria non riconosciuta: "${originalCategory}" per ${name}`);
    }

    out.push({
      id, slug,
      name,
      city,
      country: rec.country || "",
      description: rec.description || "",
      image: imagePath,
      status: (rec.status || "").toLowerCase(),
      category: normalizedCategory,
      address: rec.address || "",
      lat: isFinite(lat!) ? lat : undefined,
      lng: isFinite(lng!) ? lng : undefined,
      tp_codes: tpCodes,
    });
  }
  
  console.log("Luoghi con coordinate:", out.filter(p => p.lat && p.lng));
  return out;
  } catch (error) {
    console.error("Errore nel caricamento dei luoghi:", error);
    throw error;
  }
}
