
import React from "react";

export type CategoryKey =
  | "cafe" | "restaurant" | "museum" | "park" | "bar"
  | "hotel" | "shop" | "viewpoint" | "beach" | "landmark" | "market" | "trail" | "culture" | "other";

const EMOJI: Record<CategoryKey, string> = {
  cafe:"☕", restaurant:"🍽️", museum:"🏛️", culture:"🖼️", park:"🌳", bar:"🍺",
  hotel:"🛎️", shop:"🛍️", viewpoint:"🗻", beach:"🏖️",
  landmark:"📸", market:"🧺", trail:"🥾", other:"📍",
};

function strip(s:string){ return s.normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
export function normalizeCategory(input?: string): CategoryKey {
  if (!input) return "other";
  const s = strip(input.trim().toLowerCase());
  if (["cafe","caffe","caffè","coffee"].includes(s)) return "cafe";
  if (["restaurant","ristorante","osteria","trattoria"].includes(s)) return "restaurant";
  if (["museum","museo","galleria","gallery"].includes(s)) return "museum";
  if (["park","parco","giardino"].includes(s)) return "park";
  if (["bar","pub","winebar","enoteca"].includes(s)) return "bar";
  if (["hotel","bnb","b&b","hostel"].includes(s)) return "hotel";
  if (["shop","negozio","boutique","store"].includes(s)) return "shop";
  if (["viewpoint","belvedere","panorama"].includes(s)) return "viewpoint";
  if (["culture","art ","chiese"].includes(s)) return "culture";
  if (["beach","spiaggia","lido"].includes(s)) return "beach";
  if (["landmark","monumento","iconico"].includes(s)) return "landmark";
  if (["market","mercato","street market"].includes(s)) return "market";
  if (["trail","sentiero","trekking"].includes(s)) return "trail";
  return "other";
}

export default function CategoryBadge({ category, showLabel=false }:{
  category?: string; showLabel?: boolean;
}) {
  const key = normalizeCategory(category);
  const emoji = EMOJI[key];
  const labelMap: Record<CategoryKey,string> = {
    cafe:"Caffè", restaurant:"Ristorante", museum:"Museo", park:"Parco",
    bar:"Bar", hotel:"Hotel", shop:"Negozio", viewpoint:"Belvedere",
    beach:"Spiaggia", landmark:"Monumento", market:"Mercato", trail:"Sentiero", culture:"Cultura", other:"Altro"
  };
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
      <span>{emoji}</span>
      {showLabel && <span className="text-xs font-medium">{labelMap[key]}</span>}
    </span>
  );
}

export function categoryEmoji(c?: string){ return EMOJI[normalizeCategory(c)]; }
