-- Tabella per gestire le città (Big POI City)
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  zoom_level INTEGER DEFAULT 12,
  poi_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Policy: tutti possono leggere le città
CREATE POLICY "Cities are viewable by everyone" 
ON public.cities 
FOR SELECT 
USING (true);

-- Policy: solo per operazioni admin (gestite via edge function con service role)
CREATE POLICY "Cities can be modified via service role" 
ON public.cities 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserisco Como come città iniziale (attiva di default)
INSERT INTO public.cities (name, slug, lat, lng, is_active, zoom_level)
VALUES ('Como', 'como', 45.8080, 9.0852, true, 12);

-- Inserisco Milano come città di esempio (non attiva)
INSERT INTO public.cities (name, slug, lat, lng, is_active, zoom_level)
VALUES ('Milano', 'milano', 45.4642, 9.1900, false, 12);

-- Inserisco Bergamo come città di esempio (non attiva)
INSERT INTO public.cities (name, slug, lat, lng, is_active, zoom_level)
VALUES ('Bergamo', 'bergamo', 45.6983, 9.6773, false, 12);