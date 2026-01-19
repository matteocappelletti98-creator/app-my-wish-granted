import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Category options mapping
const categoryLabels: Record<string, string> = {
  "culture": "🖼️ Art & Culture",
  "bakery": "🥨 Bakery and Pastry",
  "pizza": "🍕 Pizza",
  "restaurant": "👨‍🍳 Restaurants",
  "cocktails": "🍸 Bars & Cocktails",
  "cafe": "☕️ Café",
  "gelato": "🍦 Gelato",
  "nightlife": "🌙 Night Life",
  "late_night_eats": "🌑 Late Night Eats",
  "shop": "🛍️ Shopping",
  "luxury": "💎 Private & Luxury",
  "attractions": "🎢 Attractions",
  "stroll": "🚶 Strolls",
  "secret": "🤫 Secret Places",
  "adventure": "🏔️ Adventure",
  "refuge": "🍲 Mountain Refuge",
  "lidi": "🏝️ Beach Resorts",
  "free_beaches": "🏖️ Free Beaches",
  "villa": "⛲️ Villa",
  "boat": "🛥️ Boat Rental",
  "bike": "🚴 Bike Riding",
  "rent_a_ride": "🛵 Rent a Ride",
  "local_life": "🏡 Local Life",
  "relax": "🧘 Relax",
  "grocery": "🛒 Grocery",
  "cinema_books": "🎬 Cinema and Bookstores",
  "gym": "💪 Gym",
  "transport": "🚌 Public Transport",
  "taxi": "🚕 Taxi & Private Transport",
  "parking": "🅿️ Parking",
  "atm": "🏧 ATM",
  "luggage": "🛄 Luggage Storage",
  "wc": "🚻 Public Toilets",
};

// Traveller Path code labels
const tpCodeLabels: Record<number, string> = {
  1: "Local", 2: "Viaggiatore", 3: "Uomo", 4: "Donna", 5: "Altro genere",
  6: "< 18 anni", 7: "18-24 anni", 8: "25-34 anni", 9: "35-49 anni", 10: "50-64 anni", 11: "> 64 anni",
  12: "Avventura", 13: "Relax", 14: "Cultura", 15: "Shopping", 16: "Night life", 17: "Foodie", 18: "Lusso",
  19: "Tradizionale", 20: "Alta cucina", 21: "Fusion", 22: "Wine pairing", 23: "Street food",
  24: "Vegana", 25: "Vegetariana", 26: "Senza glutine", 27: "Biologico", 28: "Pesce", 29: "Carne", 30: "Brunch spot", 31: "Quick Bite",
  32: "Europa", 33: "Nord America", 34: "Sud America", 35: "Asia", 36: "Africa", 37: "Medio Oriente", 38: "Oceania",
  39: "Budget Basso", 40: "Budget Medio", 41: "Budget Premium",
  42: "1 giorno", 43: "2 giorni", 44: "3-7 giorni", 45: "> 7 giorni",
  46: "Solo", 47: "Coppia", 48: "Gruppo", 49: "Famiglia",
  50: "Trasporto Proprio", 51: "Nessun Trasporto", 52: "Noleggio",
};

interface SuggestionRequest {
  placeName: string;
  city?: string;
  description?: string;
  senderName: string;
  category?: string;
  tpCodes?: number[];
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received suggestion request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName, city, description, senderName, category, tpCodes }: SuggestionRequest = await req.json();

    console.log("Suggestion data:", { placeName, city, senderName, category, tpCodes });

    // Validate required fields
    if (!placeName || !senderName) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields: placeName and senderName are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format category
    const categoryDisplay = category ? categoryLabels[category] || category : null;

    // Format traveller path codes
    const tpCodesDisplay = tpCodes && tpCodes.length > 0 
      ? tpCodes.map(code => tpCodeLabels[code] || `Codice ${code}`).join(", ")
      : null;

    const emailResponse = await resend.emails.send({
      from: "True Local <onboarding@resend.dev>",
      to: ["matteocappelletti98@gmail.com"],
      subject: `🗺️ Nuovo suggerimento: ${placeName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a5a7a, #288cbd); color: white; padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🗺️ Nuovo Suggerimento Luogo</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">True Local - Lake Como</p>
          </div>
          
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">📍 Nome Luogo</strong><br>
                  <span style="color: #334155; font-size: 16px;">${placeName}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">👤 Inviato da</strong><br>
                  <span style="color: #334155; font-size: 16px;">${senderName}</span>
                </td>
              </tr>
              ${city ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">📌 Città</strong><br>
                  <span style="color: #334155; font-size: 16px;">${city}</span>
                </td>
              </tr>
              ` : ''}
              ${categoryDisplay ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">🏷️ Categoria</strong><br>
                  <span style="color: #334155; font-size: 16px;">${categoryDisplay}</span>
                </td>
              </tr>
              ` : ''}
              ${tpCodesDisplay ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">🧭 Traveller Path</strong><br>
                  <span style="color: #334155; font-size: 16px;">${tpCodesDisplay}</span>
                </td>
              </tr>
              ` : ''}
              ${description ? `
              <tr>
                <td style="padding: 12px 0;">
                  <strong style="color: #1a5a7a;">📝 Perché lo consiglia</strong><br>
                  <span style="color: #334155; font-size: 16px;">${description}</span>
                </td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <p style="color: #64748b; font-size: 12px; text-align: center; margin-top: 20px;">
            Questo messaggio è stato inviato automaticamente da True Local App
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-suggestion function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
