// src/lib/sheet.ts

export type Place = {
  id: string;                 // <-- NEW
  name: string;
  city: string;
  country: string;
  description: string;
  image?: string;
  status: string;
  category?: string;
};

// --- helpers ---
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { cell += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      row.push(cell); cell = "";
    } else if ((ch === "\n" || ch === "\r") && !inQuotes) {
      if (cell.length || row.length) { row.push(cell); rows.push(row); row = []; cell = ""; }
      if (ch === "\r" && next === "\n") i++;
    } else {
      cell += ch;
    }
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

// simple stable slug/id from name+city (+fallback to index)
function toSlug(s: string) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function fetchPlacesFromSheet(csvUrl: string): Promise<Place[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error("Impossibile leggere il CSV del foglio");
  const text = await res.text();
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);

  const out: Place[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rec: any = {};
    headers.forEach((h, idx) => rec[h] = (r[idx] ?? "").trim());

    const name = rec.name || "";
    const city = rec.city || "";
    const base = toSlug(`${name}-${city}`);
    const id = base ? base : `row-${i}`;   // stable id if possible, else fallback

    out.push({
      id,
      name,
      city,
      country: rec.country || "",
      description: rec.description || "",
      image: rec.image || "",
      status: (rec.status || "").toLowerCase(),
      category: rec.category || "other",
    });
  }
  return out;
}