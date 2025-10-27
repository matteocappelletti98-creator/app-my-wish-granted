
import React from "react";

export type CategoryKey =
  | "cafe" | "restaurant" | "museum" | "park" | "bar"
  | "hotel" | "shop" | "viewpoint" | "beach" | "landmark" | "market" | "trail" | "culture" 
  | "pizza" | "taxi" | "calcio" | "boat" | "attractions" | "cocktails" | "gym" 
  | "parking" | "free_beaches" | "bike" | "luxury" | "transport" | "villa" 
  | "stroll" | "lidi" | "secret" | "gelato" | "daytrips" | "bakery" | "shopping_hq" | "wc" | "adventure" | "other";

const EMOJI: Record<CategoryKey, string> = {
  cafe:"☕", restaurant:"🍽️", museum:"🏛️", culture:"🖼️", bar:"🍺",
  hotel:"🛎️", shop:"🛍️", viewpoint:"🗻", beach:"🏖️",
  landmark:"📸", market:"🧺", trail:"🥾", park:"🌳", 
  pizza:"🍕", taxi:"🚕", calcio:"⚽", boat:"🛥️", attractions:"🎢",
  cocktails:"🍸", gym:"💪", parking:"🅿️", free_beaches:"🏖️", bike:"🚴",
  luxury:"💎", transport:"🚌", villa:"⛲️", stroll:"🚶", lidi:"🏝️",
  secret:"🤫", gelato:"🍦", daytrips:"🗓️", bakery:"🥖", shopping_hq:"👑", wc:"🚻", adventure:"🏔️", other:"📍",
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
  if (["adventure","avventura","adventures"].includes(s)) return "adventure";
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
    beach:"Spiaggia", landmark:"Monumento", market:"Mercato", trail:"Sentiero", culture:"Cultura",
    pizza:"Pizza", taxi:"Taxi", calcio:"Calcio Como", boat:"Noleggio Barche", attractions:"Attrazioni",
    cocktails:"Cocktail Bar", gym:"Palestra", parking:"Parcheggio", free_beaches:"Spiagge Libere", bike:"Bicicletta",
    luxury:"Lusso", transport:"Trasporti", villa:"Villa", stroll:"Passeggiata", lidi:"Lidi",
    secret:"Luoghi Segreti", gelato:"Gelato", daytrips:"Gite", bakery:"Panetteria", shopping_hq:"Shopping di Qualità", wc:"WC", adventure:"Avventura", other:"Altro"
  };
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
      <span>{emoji}</span>
      {showLabel && <span className="text-xs font-medium">{labelMap[key]}</span>}
    </span>
  );
}

export function categoryEmoji(c?: string){ return EMOJI[normalizeCategory(c)]; }
