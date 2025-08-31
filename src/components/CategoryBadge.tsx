// src/components/CategoryBadge.tsx
import React from "react";

export type CategoryKey =
  | "cafe" | "restaurant" | "museum" | "park" | "bar"
  | "hotel" | "shop" | "viewpoint" | "beach" | "other";

const CAT: Record<CategoryKey, { emoji: string; bg: string; text: string; label: string }> = {
  cafe:      { emoji: "☕", bg: "bg-amber-100",  text: "text-amber-800",  label: "Caffè" },
  restaurant:{ emoji: "🍽️", bg: "bg-orange-100", text: "text-orange-800", label: "Ristorante" },
  museum:    { emoji: "🏛️", bg: "bg-indigo-100", text: "text-indigo-800", label: "Museo" },
  park:      { emoji: "🌳", bg: "bg-green-100",  text: "text-green-800",  label: "Parco" },
  bar:       { emoji: "🍺", bg: "bg-yellow-100", text: "text-yellow-800", label: "Bar" },
  hotel:     { emoji: "🛎️", bg: "bg-fuchsia-100",text: "text-fuchsia-800",label: "Hotel" },
  shop:      { emoji: "🛍️", bg: "bg-pink-100",   text: "text-pink-800",   label: "Negozio" },
  viewpoint: { emoji: "🗻", bg: "bg-sky-100",    text: "text-sky-800",    label: "Belvedere" },
  beach:     { emoji: "🏖️", bg: "bg-cyan-100",   text: "text-cyan-800",   label: "Spiaggia" },
  other:     { emoji: "📍", bg: "bg-gray-100",   text: "text-gray-700",   label: "Altro" },
};

function removeDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Accetta sinonimi/italiano e normalizza alla chiave icona */
export function normalizeCategory(input?: string): CategoryKey {
  if (!input) return "other";
  const s = removeDiacritics(input.trim().toLowerCase());
  if (["cafe","caffe","caffè","coffee"].includes(s)) return "cafe";
  if (["restaurant","ristorante","osteria","trattoria"].includes(s)) return "restaurant";
  if (["museum","museo","galleria","gallery"].includes(s)) return "museum";
  if (["park","parco","giardino"].includes(s)) return "park";
  if (["bar","pub","enoteca","winebar"].includes(s)) return "bar";
  if (["hotel","bnb","b&b","hostel"].includes(s)) return "hotel";
  if (["shop","negozio","boutique","store"].includes(s)) return "shop";
  if (["viewpoint","belvedere","panorama"].includes(s)) return "viewpoint";
  if (["beach","spiaggia","lido"].includes(s)) return "beach";
  return "other";
}

export default function CategoryBadge({
  category,
  className = "",
  showLabel = false,
}: { category?: string; className?: string; showLabel?: boolean }) {
  const key = normalizeCategory(category);
  const c = CAT[key];
  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${c.bg} ${c.text} ${className}`}>
      <span aria-hidden>{c.emoji}</span>
      {showLabel && <span className="text-xs font-medium">{c.label}</span>}
    </div>
  );
}