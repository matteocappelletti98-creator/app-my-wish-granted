import React from "react";

export type CategoryKey =
  | "cafe"
  | "restaurant"
  | "museum"
  | "park"
  | "bar"
  | "pub"
  | "culture"
  | "hotel"
  | "shop"
  | "viewpoint"
  | "beach"
  | "pizza"
  | "taxi"
  | "calcio"
  | "boat"
  | "attractions"
  | "cocktails"
  | "gym"
  | "parking"
  | "free_beaches"
  | "bike"
  | "luxury"
  | "transport"
  | "villa"
  | "stroll"
  | "lidi"
  | "secret"
  | "gelato"
  | "daytrips"
  | "bakery"
  | "shopping_hq"
  | "wc"
  | "adventure"
  | "refuge"
  | "grocery"
  | "nightlife"
  | "streetfood"
  | "luggage"
  | "atm"
  | "rent_a_ride"
  | "local_life"
  | "late_night_eats"
  | "relax"
  | "cinema_books"
  | "other";

const EMOJI: Record<CategoryKey, string> = {
  cafe: "☕️",
  restaurant: "👨‍🍳",
  museum: "🏛️",
  culture: "🖼️",
  bar: "🍸",
  pub: "🍻",
  hotel: "🛎️",
  shop: "🛍️",
  viewpoint: "🗻",
  beach: "🏖️",
  park: "🌳",
  pizza: "🍕",
  taxi: "🚕",
  calcio: "⚽",
  boat: "🛥️",
  attractions: "🎢",
  cocktails: "🍸",
  gym: "💪",
  parking: "🅿️",
  free_beaches: "🏖️",
  bike: "🚴",
  luxury: "💎",
  transport: "🚌",
  villa: "⛲️",
  stroll: "🚶",
  lidi: "🏝️",
  secret: "🤫",
  gelato: "🍦",
  daytrips: "🗓️",
  bakery: "🥨",
  shopping_hq: "👑",
  wc: "🚻",
  adventure: "🏔️",
  refuge: "🍲",
  grocery: "🛒",
  nightlife: "🌙",
  streetfood: "🌮",
  luggage: "🛄",
  atm: "🏧",
  rent_a_ride: "🛵",
  local_life: "🏡",
  late_night_eats: "🌑",
  relax: "🧘",
  cinema_books: "🎬",
  other: "📍",
};

function strip(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
export function normalizeCategory(input?: string): CategoryKey {
  if (!input) return "other";
  const s = strip(input.trim().toLowerCase());

  // Direct key match (already normalized)
  if (s === "late_night_eats") return "late_night_eats";
  if (s === "local_life") return "local_life";
  if (s === "rent_a_ride") return "rent_a_ride";
  if (s === "cinema_books") return "cinema_books";
  if (s === "free_beaches") return "free_beaches";
  if (s === "shopping_hq") return "shopping_hq";
  if (s === "cocktails") return "cocktails";
  if (s === "nightlife") return "nightlife";
  if (s === "streetfood") return "streetfood";
  if (s === "culture") return "culture";
  if (s === "restaurant") return "restaurant";
  if (s === "transport") return "transport";
  if (s === "bakery") return "bakery";
  if (s === "stroll") return "stroll";
  if (s === "lidi") return "lidi";
  if (s === "refuge") return "refuge";
  if (s === "luggage") return "luggage";
  if (s === "wc") return "wc";
  if (s === "taxi") return "taxi";
  if (s === "boat") return "boat";
  if (s === "luxury") return "luxury";
  if (s === "secret") return "secret";
  if (s === "daytrips") return "daytrips";
  if (s === "relax") return "relax";

  // Exact matches from CSV
  if (s === "art & culture" || s === "art&culture") return "culture";
  if (s === "bakery" || s === "bakery and pastry") return "bakery";
  if (s === "public transport") return "transport";
  if (s === "public toilets") return "wc";
  if (s === "restaurants") return "restaurant";
  if (s === "bars & cocktails" || s === "bars&cocktails") return "cocktails";
  if (s === "cafe") return "cafe";
  if (s === "street food") return "streetfood";
  if (s === "bike riding") return "bike";
  if (s === "luggage storage") return "luggage";
  if (s === "taxi & private transport" || s === "taxi&private transport") return "taxi";
  if (s === "atm") return "atm";
  if (s === "boat rental") return "boat";
  if (s === "night life" || s === "nightlife") return "nightlife";
  if (s === "shopping") return "shop";
  if (s === "luxury shopping") return "shopping_hq";
  if (s === "private & luxury" || s === "private&luxury") return "luxury";
  if (s === "mountain refuge") return "refuge";
  if (s === "strolls") return "stroll";
  if (s === "beach resorts") return "lidi";
  if (s === "secret places") return "secret";
  if (s === "day trips") return "daytrips";
  if (s === "grocery") return "grocery";

  // Fallback synonyms
  if (["cafe", "caffe", "caffè", "coffee"].includes(s)) return "cafe";
  if (["restaurant", "ristorante", "osteria", "trattoria"].includes(s)) return "restaurant";
  if (["museum", "museo", "galleria", "gallery"].includes(s)) return "museum";
  if (["park", "parco", "giardino"].includes(s)) return "park";
  if (["bar", "winebar", "enoteca"].includes(s)) return "bar";
  if (["pub"].includes(s)) return "pub";
  if (["culture", "art", "chiese"].includes(s)) return "culture";
  if (["hotel", "bnb", "b&b", "hostel"].includes(s)) return "hotel";
  if (["shop", "negozio", "boutique", "store"].includes(s)) return "shop";
  if (["viewpoint", "belvedere", "panorama"].includes(s)) return "viewpoint";
  if (["beach", "spiaggia", "lido"].includes(s)) return "beach";
  if (["pizza", "pizzeria"].includes(s)) return "pizza";
  if (["taxi", "cab"].includes(s)) return "taxi";
  if (["calcio como 1907", "calcio", "football", "soccer", "como"].includes(s)) return "calcio";
  if (["boat", "noleggio barche"].includes(s)) return "boat";
  if (["attractions", "attrazione", "attrazioni"].includes(s)) return "attractions";
  if (["cocktails", "cocktail bar", "bar and cocktails"].includes(s)) return "cocktails";
  if (["gym", "palestra", "fitness"].includes(s)) return "gym";
  if (["parking garage", "parking", "parcheggio"].includes(s)) return "parking";
  if (["free beaches", "spiagge libere", "beach free"].includes(s)) return "free_beaches";
  if (["bike", "bicicletta", "cycling"].includes(s)) return "bike";
  if (["luxury", "lusso", "privato", "private and luxury"].includes(s)) return "luxury";
  if (["transport", "trasporti", "bus", "metro"].includes(s)) return "transport";
  if (["villa", "ville"].includes(s)) return "villa";
  if (["stroll", "passeggiata", "walk"].includes(s)) return "stroll";
  if (["lidi", "beach resort", "stabilimento balneare"].includes(s)) return "lidi";
  if (["secret", "segreti", "nascosti"].includes(s)) return "secret";
  if (["gelato", "gelti", "ice cream"].includes(s)) return "gelato";
  if (["gite", "escursioni", "day trip"].includes(s)) return "daytrips";
  if (["panetteria", "forno"].includes(s)) return "bakery";
  if (["shopping ( high quality )", "shopping high quality", "alta qualita"].includes(s)) return "shopping_hq";
  if (["wc", "bagno", "toilette", "restroom", "bathroom"].includes(s)) return "wc";
  if (["adventure", "avventura", "adventures"].includes(s)) return "adventure";
  if (["refuge", "rifugio", "rifugi", "mountain hut"].includes(s)) return "refuge";
  if (["supermercato", "alimentari", "market", "supermarket"].includes(s)) return "grocery";
  if (["nightlife", "vita notturna", "night"].includes(s)) return "nightlife";
  if (["street food", "cibo di strada"].includes(s)) return "streetfood";
  if (["luggage", "bagagli", "deposito bagagli"].includes(s)) return "luggage";
  if (["rent a ride", "noleggio", "scooter", "monopattino"].includes(s)) return "rent_a_ride";
  if (["local life", "vita locale"].includes(s)) return "local_life";
  if (["late night eats", "cibo notturno"].includes(s)) return "late_night_eats";
  if (["relax", "spa", "wellness", "benessere"].includes(s)) return "relax";
  if (["cinema and bookstores", "cinema", "libreria", "bookstore"].includes(s)) return "cinema_books";

  return "other";
}

export default function CategoryBadge({ category, showLabel = false }: { category?: string; showLabel?: boolean }) {
  const key = normalizeCategory(category);
  const emoji = EMOJI[key];
  const labelMap: Record<CategoryKey, string> = {
    cafe: "Café",
    restaurant: "Restaurants",
    museum: "Museo",
    park: "Parco",
    bar: "Bar",
    pub: "Pub",
    hotel: "Hotel",
    shop: "Shopping",
    viewpoint: "Belvedere",
    beach: "Spiaggia",
    culture: "Art & Culture",
    pizza: "Pizza",
    taxi: "Taxi & Private Transport",
    calcio: "Calcio Como",
    boat: "Boat Rental",
    attractions: "Attractions",
    cocktails: "Bars & Cocktails",
    gym: "Gym",
    parking: "Parking",
    free_beaches: "Free Beaches",
    bike: "Bike Riding",
    luxury: "Private & Luxury",
    transport: "Public Transport",
    villa: "Villa",
    stroll: "Strolls",
    lidi: "Beach Resorts",
    secret: "Secret Places",
    gelato: "Gelato",
    daytrips: "Day Trips",
    bakery: "Bakery and Pastry",
    shopping_hq: "Luxury Shopping",
    wc: "Public Toilets",
    adventure: "Adventure",
    refuge: "Mountain Refuge",
    grocery: "Grocery",
    nightlife: "Night Life",
    streetfood: "Street Food",
    luggage: "Luggage Storage",
    atm: "ATM",
    rent_a_ride: "Rent a Ride",
    local_life: "Local Life",
    late_night_eats: "Late Night Eats",
    relax: "Relax",
    cinema_books: "Cinema and Bookstores",
    other: "Other",
  };
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
      <span>{emoji}</span>
      {showLabel && <span className="text-xs font-medium">{labelMap[key]}</span>}
    </span>
  );
}

export function categoryEmoji(c?: string) {
  return EMOJI[normalizeCategory(c)];
}
