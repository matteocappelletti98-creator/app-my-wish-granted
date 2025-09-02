// src/config.ts
// === Brand ===
export const BRAND = {
  name: "explore",
  blue: "#1E66F5", // titles and accents
  gray: "#64748B"
};

// === Data Sources ===
// Put your published CSV URLs here (File → Share → Publish to the web in Google Sheets, format: CSV)
export const HOME_CSV_URL = "https://docs.google.com/spreadsheets/d/REPLACE_WITH_HOME_SHEET_ID/export?format=csv&gid=0";
export const MY_CSV_URL   = "https://docs.google.com/spreadsheets/d/REPLACE_WITH_MY_SHEET_ID/export?format=csv&gid=0";

// === Google Form integration ===
// Base form URL (viewform). We will append prefill parameters.
export const GOOGLE_FORM = {
  baseUrl: "https://docs.google.com/forms/d/e/REPLACE_FORM_ID/viewform",
  // Set to true if you want the embedded version in an <iframe> on /add-place
  embedded: true,
  // Map your Google Form 'entry' ids for the latitude/longitude and (optionally) a source/context field.
  // To find these IDs, open your form prefill URL, inspect the query parameters: example ?entry.123456=...
  entries: {
    lat: "entry.LAT_ID",      // e.g. entry.1234567890
    lng: "entry.LNG_ID",      // e.g. entry.0987654321
    source: "entry.SOURCE_ID" // optional: e.g. entry.1122334455
  }
};
