import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Password admin semplice
const ADMIN_PASSWORD = "2324";

interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  lat: number;
  lng: number;
  zoom_level: number;
  poi_count: number;
  created_at: string;
  updated_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Verifica password per operazioni di modifica
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      const body = await req.json();
      
      if (body.password !== ADMIN_PASSWORD) {
        console.log("Password errata fornita");
        return new Response(
          JSON.stringify({ error: 'Password non valida' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // GET: Lista tutte le città
      if (action === 'list') {
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('name');

        if (error) throw error;

        return new Response(
          JSON.stringify({ cities: data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // POST: Crea nuova città
      if (action === 'create') {
        const { name, lat, lng, zoom_level } = body;
        
        if (!name || lat === undefined || lng === undefined) {
          return new Response(
            JSON.stringify({ error: 'Nome, lat e lng sono obbligatori' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const slug = name.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const { data, error } = await supabase
          .from('cities')
          .insert({
            name,
            slug,
            lat,
            lng,
            zoom_level: zoom_level || 12,
            is_active: false
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`Città creata: ${name}`);
        return new Response(
          JSON.stringify({ city: data, message: 'Città creata con successo' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // PUT: Aggiorna città (toggle attivo, modifica dati)
      if (action === 'update') {
        const { id, is_active, name, lat, lng, zoom_level } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID città obbligatorio' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const updateData: Partial<City> = {};
        if (is_active !== undefined) updateData.is_active = is_active;
        if (name) updateData.name = name;
        if (lat !== undefined) updateData.lat = lat;
        if (lng !== undefined) updateData.lng = lng;
        if (zoom_level !== undefined) updateData.zoom_level = zoom_level;

        const { data, error } = await supabase
          .from('cities')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        console.log(`Città aggiornata: ${data.name}, attiva: ${data.is_active}`);
        return new Response(
          JSON.stringify({ city: data, message: 'Città aggiornata con successo' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // DELETE: Elimina città
      if (action === 'delete') {
        const { id } = body;
        
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID città obbligatorio' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('cities')
          .delete()
          .eq('id', id);

        if (error) throw error;

        console.log(`Città eliminata: ${id}`);
        return new Response(
          JSON.stringify({ message: 'Città eliminata con successo' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update POI count for a city
      if (action === 'update-poi-count') {
        const { id, poi_count } = body;
        
        if (!id || poi_count === undefined) {
          return new Response(
            JSON.stringify({ error: 'ID e poi_count sono obbligatori' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { data, error } = await supabase
          .from('cities')
          .update({ poi_count })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify({ city: data, message: 'Conteggio POI aggiornato' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET senza password: lista città pubbliche (solo attive)
    if (req.method === 'GET') {
      const includeInactive = url.searchParams.get('all') === 'true';
      
      let query = supabase.from('cities').select('*').order('name');
      
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ cities: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Azione non valida' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Errore:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
