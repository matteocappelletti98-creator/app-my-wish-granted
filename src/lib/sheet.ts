
// src/lib/sheet.ts
export type Place = {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  image?: string;
  status: string;
  category?: string;
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cell = ""; let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i+1];
    if (ch === '"') { if (inQuotes && next === '"') { cell += '"'; i++; } else inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { row.push(cell); cell = ""; }
    else if ((ch === '\n' || ch === '\r') && !inQuotes) { if (cell.length || row.length) { row.push(cell); rows.push(row); row = []; cell = ""; } if (ch === '\r' && next === '\n') i++; }
    else { cell += ch; }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function normalizeHeader(h: string) {
  const key = h.trim().toLowerCase();
  const map: Record<string, string> = {
    "nome del luogo":"name","name":"name",
    "città":"city","city":"city",
    "paese":"country","country":"country",
    "descrizione":"description","description":"description",
    "immagine (url opzionale)":"image","image":"image","image_url":"image",
    "status":"status",
    "categoria":"category","category":"category",
  };
  return map[key] || key;
}

export async function fetchPlacesFromSheet(csvUrl: string): Promise<Place[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error("Impossibile leggere il CSV del foglio");
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);

  return rows.slice(1).map((r, index) => {
    const rec: any = {};
    headers.forEach((h, i) => (rec[h] = (r[i] ?? "").trim()));
    return {
      id: index + 1, // Generate ID based on row index
      name: rec.name || "",
      city: rec.city || "",
      country: rec.country || "",
      description: rec.description || "",
      image: rec.image || "",
      status: (rec.status || "").toLowerCase(),
      category: rec.category || "other",
    } as Place;
  });
}
