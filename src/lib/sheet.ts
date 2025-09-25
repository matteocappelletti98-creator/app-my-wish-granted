// src/lib/sheet.ts
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
  };
  return map[key] || key;
}

function toSlug(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,80);
}

export async function fetchPlacesFromSheet(csvUrl: string): Promise<Place[]> {
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
    const idBase = toSlug(`${name}-${city}`);
    const id = idBase || `row-${i}`;
    const slug = id;

    const lat = rec.lat ? Number(rec.lat) : undefined;
    const lng = rec.lng ? Number(rec.lng) : undefined;

    console.log(`Parsing ${name}: lat=${rec.lat} -> ${lat}, lng=${rec.lng} -> ${lng}`);

    out.push({
      id, slug,
      name,
      city,
      country: rec.country || "",
      description: rec.description || "",
      image: rec.image || "",
      status: (rec.status || "").toLowerCase(),
      category: (rec.category || "other"),
      address: rec.address || "",
      lat: isFinite(lat!) ? lat : undefined,
      lng: isFinite(lng!) ? lng : undefined,
    });
  }
  
  console.log("Luoghi con coordinate:", out.filter(p => p.lat && p.lng));
  return out;
}
