
import {
  Coffee, Utensils, Building2, TreePine, Beer, Hotel, ShoppingBag,
  Mountain, Waves, MapPin, BookImage, Pizza, Car, Circle, Ship,
  Dumbbell, ParkingCircle, Bike, Crown, Bus, Home, Navigation,
  MapPinOff, IceCream, Calendar, ShoppingCart, Sparkles, LucideIcon
} from "lucide-react";

export type CategoryKey =
  | "cafe" | "restaurant" | "museum" | "park" | "bar" | "culture"
  | "hotel" | "shop" | "viewpoint" | "beach" | "pizza" | "taxi" | "calcio" 
  | "boat" | "attractions" | "cocktails" | "gym" | "parking" | "free_beaches" 
  | "bike" | "luxury" | "transport" | "villa" | "stroll" | "lidi" | "secret" 
  | "gelato" | "daytrips" | "bakery" | "shopping_hq" | "wc" | "other";

const ICONS: Record<CategoryKey, LucideIcon> = {
  cafe: Coffee,
  restaurant: Utensils,
  museum: Building2,
  park: TreePine,
  bar: Beer,
  hotel: Hotel,
  shop: ShoppingBag,
  viewpoint: Mountain,
  beach: Waves,
  culture: BookImage,
  pizza: Pizza,
  taxi: Car,
  calcio: Circle,
  boat: Ship,
  attractions: Sparkles,
  cocktails: Beer,
  gym: Dumbbell,
  parking: ParkingCircle,
  free_beaches: Waves,
  bike: Bike,
  luxury: Crown,
  transport: Bus,
  villa: Home,
  stroll: Navigation,
  lidi: Waves,
  secret: MapPinOff,
  gelato: IceCream,
  daytrips: Calendar,
  bakery: Coffee,
  shopping_hq: ShoppingCart,
  wc: MapPin,
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
  if (["culture","art ","chiese"].includes(s)) return "culture";
  if (["hotel", "bnb", "b&b", "hostel"].includes(s)) return "hotel";
  if (["shop", "negozio", "boutique", "store"].includes(s)) return "shop";
  if (["viewpoint", "belvedere", "panorama"].includes(s)) return "viewpoint";
  if (["beach", "spiaggia", "lido"].includes(s)) return "beach";
  if (["pizza","pizzeria"].includes(s)) return "pizza";
  if (["taxi","cab"].includes(s)) return "taxi";
  if (["calcio como 1907","calcio","football","soccer","como"].includes(s)) return "calcio";
  if (["boat rental","boat","noleggio barche"].includes(s)) return "boat";
  if (["attractions","attrazione","attrazioni"].includes(s)) return "attractions";
  if (["bar and cocktails","cocktails","cocktail bar"].includes(s)) return "cocktails";
  if (["gym","palestra","fitness"].includes(s)) return "gym";
  if (["parking garage","parking","parcheggio"].includes(s)) return "parking";
  if (["free beaches","spiagge libere","beach free"].includes(s)) return "free_beaches";
  if (["bike riding","bike","bicicletta","cycling"].includes(s)) return "bike";
  if (["private and luxury","luxury","lusso","privato"].includes(s)) return "luxury";
  if (["public transport","transport","trasporti","bus","metro"].includes(s)) return "transport";
  if (["villa","ville"].includes(s)) return "villa";
  if (["stroll","passeggiata","walk"].includes(s)) return "stroll";
  if (["lidi","beach resort","stabilimento balneare"].includes(s)) return "lidi";
  if (["secret places","secret","segreti","nascosti"].includes(s)) return "secret";
  if (["gelato","gelti","ice cream"].includes(s)) return "gelato";
  if (["day trips","gite","escursioni"].includes(s)) return "daytrips";
  if (["bakery","panetteria","forno"].includes(s)) return "bakery";
  if (["shopping ( high quality )","shopping high quality","alta qualità"].includes(s)) return "shopping_hq";
  if (["wc","bagno","toilette","restroom","bathroom"].includes(s)) return "wc";

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
