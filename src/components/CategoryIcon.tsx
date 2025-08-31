import {
  Coffee, Utensils, Building2, TreePine, Beer, Hotel, ShoppingBag,
  Mountain, Waves, MapPin
} from "lucide-react";

export type CategoryKey =
  | "cafe" | "restaurant" | "museum" | "park" | "bar"
  | "hotel" | "shop" | "viewpoint" | "beach" | "other";

const ICONS: Record<CategoryKey, React.ComponentType<{ size?: number; className?: string }>> = {
  cafe: Coffee,
  restaurant: Utensils,
  museum: Building2,
  park: TreePine,
  bar: Beer,
  hotel: Hotel,
  shop: ShoppingBag,
  viewpoint: Mountain,
  beach: Waves,
  other: MapPin,
};

function removeDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Accetta sinonimi/italiano e normalizza alla chiave icona */
export function normalizeCategory(input?: string): CategoryKey {
  if (!input) return "other";
  const s = removeDiacritics(input.trim().toLowerCase());

  if (["cafe", "caffe", "caffè", "coffee"].includes(s)) return "cafe";
  if (["restaurant", "ristorante", "osteria", "trattoria"].includes(s)) return "restaurant";
  if (["museum", "museo", "galleria", "gallery"].includes(s)) return "museum";
  if (["park", "parco", "giardino"].includes(s)) return "park";
  if (["bar", "pub", "winebar", "enoteca"].includes(s)) return "bar";
  if (["hotel", "bnb", "b&b", "hostel"].includes(s)) return "hotel";
  if (["shop", "negozio", "boutique", "store"].includes(s)) return "shop";
  if (["viewpoint", "belvedere", "panorama"].includes(s)) return "viewpoint";
  if (["beach", "spiaggia", "lido"].includes(s)) return "beach";

  return "other";
}

export default function CategoryIcon({
  category,
  size = 20,
  className,
}: { category?: string; size?: number; className?: string }) {
  const key = normalizeCategory(category);
  const Icon = ICONS[key];
  return <Icon size={size} className={className} />;
}