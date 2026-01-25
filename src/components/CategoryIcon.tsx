import {
  Coffee, Utensils, Pizza, IceCream, Ship, Mountain, Waves,
  MapPin, Sparkles, Home, Moon, Sandwich, ShoppingBag, Cake,
  Wine, LucideIcon, Palmtree, Bike
} from "lucide-react";

export type CategoryKey =
  | "restaurant"
  | "pizza"
  | "cafe"
  | "cocktails"
  | "gelato"
  | "bakery"
  | "late_night_eats"
  | "free_beaches"
  | "lidi"
  | "rent_a_ride"
  | "culture"
  | "attractions"
  | "local_life"
  | "adventure"
  | "nightlife"
  | "shopping"
  | "refuge"
  | "other";

const ICONS: Record<CategoryKey, LucideIcon> = {
  restaurant: Utensils,
  pizza: Pizza,
  cafe: Coffee,
  cocktails: Wine,
  gelato: IceCream,
  bakery: Cake,
  late_night_eats: Sandwich,
  free_beaches: Waves,
  lidi: Palmtree,
  rent_a_ride: Bike,
  culture: Sparkles,
  attractions: Sparkles,
  local_life: Home,
  adventure: Mountain,
  nightlife: Moon,
  shopping: ShoppingBag,
  refuge: Home,
  other: MapPin,
};

function removeDiacritics(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeCategory(input?: string): CategoryKey {
  if (!input) return "other";
  const s = removeDiacritics(input.trim().toLowerCase());

  // Direct key match (already normalized)
  if (s === "restaurant") return "restaurant";
  if (s === "pizza") return "pizza";
  if (s === "cafe") return "cafe";
  if (s === "cocktails") return "cocktails";
  if (s === "gelato") return "gelato";
  if (s === "bakery") return "bakery";
  if (s === "late_night_eats") return "late_night_eats";
  if (s === "free_beaches") return "free_beaches";
  if (s === "lidi") return "lidi";
  if (s === "rent_a_ride") return "rent_a_ride";
  if (s === "culture") return "culture";
  if (s === "attractions") return "attractions";
  if (s === "local_life") return "local_life";
  if (s === "adventure") return "adventure";
  if (s === "nightlife") return "nightlife";
  if (s === "shopping") return "shopping";
  if (s === "refuge") return "refuge";

  // Ristoranti
  if (["ristoranti", "restaurants", "ristorante", "osteria", "trattoria"].includes(s)) return "restaurant";
  if (s.includes("restaurant") || s.includes("ristorante") || s.includes("osteria") || s.includes("trattoria")) return "restaurant";

  // Pizza
  if (["pizzeria", "pizze"].includes(s)) return "pizza";
  if (s.includes("pizza")) return "pizza";

  // Caffè
  if (["caffe", "caffè", "coffee", "bar"].includes(s)) return "cafe";
  if (s.includes("caffe") || s.includes("coffee")) return "cafe";

  // Cocktail bar
  if (["cocktail bar", "cocktail", "bar and cocktails", "bars & cocktails", "bars&cocktails"].includes(s)) return "cocktails";
  if (s.includes("cocktail")) return "cocktails";

  // Gelato
  if (["gelateria", "ice cream", "gelati"].includes(s)) return "gelato";
  if (s.includes("gelato") || s.includes("ice cream")) return "gelato";

  // Pane & Dolci / Bakery & Pastry
  if (["pane & dolci", "pane&dolci", "bakery and pastry", "bakery & pastry", "bakery&pastry", "panetteria", "forno", "pasticceria", "pastry"].includes(s)) return "bakery";
  if (s.includes("bakery") || s.includes("pastry") || s.includes("panetteria") || s.includes("forno")) return "bakery";

  // Night bite
  if (["night bite", "nightbite", "late night eats", "cibo notturno"].includes(s)) return "late_night_eats";
  if (s.includes("night bite") || s.includes("late night")) return "late_night_eats";

  // Spiagge libere
  if (["spiagge libere", "free beaches", "spiaggia libera", "beach free"].includes(s)) return "free_beaches";
  if (s.includes("spiagge libere") || s.includes("free beach")) return "free_beaches";

  // Lidi
  if (["beach resorts", "stabilimento balneare", "stabilimenti balneari"].includes(s)) return "lidi";
  if (s.includes("lido") || s.includes("lidi")) return "lidi";

  // Noleggio (barche, vespa, macchine)
  if (["noleggio barche, vespa, macchine", "noleggio", "rent a ride", "boat rental", "noleggio barche", "scooter", "vespa", "car rental"].includes(s)) return "rent_a_ride";
  if (s.includes("noleggio") || s.includes("rental") || s.includes("rent")) return "rent_a_ride";

  // Cultura
  if (["art & culture", "art&culture", "art", "museo", "museum", "galleria", "gallery", "chiese", "chiesa"].includes(s)) return "culture";
  if (s.includes("culture") || s.includes("cultura") || s.includes("museo") || s.includes("museum")) return "culture";

  // Attrazioni
  if (["attrazione", "attrazioni", "attraction"].includes(s)) return "attractions";
  if (s.includes("attraz") || s.includes("attraction")) return "attractions";

  // Vita locale
  if (["vita locale", "local life"].includes(s)) return "local_life";
  if (s.includes("local life") || s.includes("vita locale")) return "local_life";

  // Avventura
  if (["avventura", "adventures"].includes(s)) return "adventure";
  if (s.includes("adventure") || s.includes("avventura")) return "adventure";

  // Night life
  if (["night life", "vita notturna", "nightclub", "club", "discoteca"].includes(s)) return "nightlife";
  if (s.includes("nightlife") || s.includes("night life") || s.includes("discoteca")) return "nightlife";

  // Shopping
  if (["shop", "negozio", "boutique", "store", "luxury shopping", "shopping ( high quality )"].includes(s)) return "shopping";
  if (s.includes("shopping") || s.includes("shop") || s.includes("boutique")) return "shopping";

  // Rifugi di Montagna
  if (["rifugi di montagna", "mountain refuge", "rifugio", "rifugi", "mountain hut"].includes(s)) return "refuge";
  if (s.includes("rifugio") || s.includes("rifugi") || s.includes("refuge")) return "refuge";

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
