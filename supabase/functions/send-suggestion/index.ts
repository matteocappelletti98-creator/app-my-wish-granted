import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SuggestionRequest {
  placeName: string;
  placeType?: string;
  location?: string;
  description?: string;
  senderName: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Received suggestion request");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { placeName, placeType, location, description, senderName }: SuggestionRequest = await req.json();

    console.log("Suggestion data:", { placeName, placeType, location, senderName });

    // Validate required fields - only placeName and senderName are required
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
              ${placeType ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">🏷️ Categoria</strong><br>
                  <span style="color: #334155; font-size: 16px;">${placeType}</span>
                </td>
              </tr>
              ` : ''}
              ${location ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                  <strong style="color: #1a5a7a;">📌 Posizione</strong><br>
                  <span style="color: #334155; font-size: 16px;">${location}</span>
                </td>
              </tr>
              ` : ''}
              ${description ? `
              <tr>
                <td style="padding: 12px 0;">
                  <strong style="color: #1a5a7a;">📝 Descrizione</strong><br>
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
