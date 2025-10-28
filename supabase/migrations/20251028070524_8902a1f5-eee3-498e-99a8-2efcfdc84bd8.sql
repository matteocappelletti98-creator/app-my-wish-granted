-- Create storage bucket for place photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('place-photos', 'place-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create table for place photos
CREATE TABLE IF NOT EXISTS public.place_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  order_index INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for place photos (public read, anyone can upload)
CREATE POLICY "Photos are viewable by everyone"
  ON public.place_photos
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can upload photos"
  ON public.place_photos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete photos"
  ON public.place_photos
  FOR DELETE
  USING (true);

-- Storage policies for place-photos bucket
CREATE POLICY "Photos are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'place-photos');

CREATE POLICY "Anyone can upload photos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'place-photos');

CREATE POLICY "Anyone can delete their photos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'place-photos');