import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitData {
  referrer?: string;
  page_path?: string;
  visitor_id?: string;
  fingerprint?: string;
  is_returning?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get client IP from headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Parse request body
    let visitData: VisitData = {};
    try {
      visitData = await req.json();
    } catch {
      // Empty body is fine
    }

    // Get geolocation from IP using free API
    let city = null;
    let country = null;
    
    if (clientIp && clientIp !== 'unknown' && clientIp !== '127.0.0.1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIp}?fields=status,country,city`);
        const geoData = await geoResponse.json();
        
        if (geoData.status === 'success') {
          city = geoData.city;
          country = geoData.country;
        }
        console.log('Geolocation data:', geoData);
      } catch (geoError) {
        console.error('Geolocation error:', geoError);
      }
    }

    // Check if this visitor has been seen before
    let isReturning = visitData.is_returning || false;
    
    if (visitData.visitor_id && !isReturning) {
      // Check database for previous visits with this visitor_id
      const { data: existingVisits } = await supabase
        .from('app_visits')
        .select('id')
        .eq('visitor_id', visitData.visitor_id)
        .limit(1);
      
      if (existingVisits && existingVisits.length > 0) {
        isReturning = true;
      }
    }

    // Insert visit record
    const { data, error } = await supabase
      .from('app_visits')
      .insert({
        ip_address: clientIp,
        city,
        country,
        referrer: visitData.referrer || null,
        user_agent: userAgent,
        page_path: visitData.page_path || '/',
        visitor_id: visitData.visitor_id || null,
        fingerprint: visitData.fingerprint || null,
        is_returning: isReturning,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log('Visit tracked:', { ip: clientIp, city, country, page: visitData.page_path });

    return new Response(
      JSON.stringify({ success: true, visit: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error tracking visit:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to track visit' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
