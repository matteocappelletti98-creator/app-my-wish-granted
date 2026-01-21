-- Add visitor tracking columns to app_visits table
ALTER TABLE public.app_visits 
ADD COLUMN IF NOT EXISTS visitor_id text,
ADD COLUMN IF NOT EXISTS fingerprint text,
ADD COLUMN IF NOT EXISTS is_returning boolean DEFAULT false;

-- Add visitor tracking columns to user_events table
ALTER TABLE public.user_events 
ADD COLUMN IF NOT EXISTS visitor_id text,
ADD COLUMN IF NOT EXISTS fingerprint text;

-- Create index for faster visitor lookups
CREATE INDEX IF NOT EXISTS idx_app_visits_visitor_id ON public.app_visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_app_visits_fingerprint ON public.app_visits(fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_events_visitor_id ON public.user_events(visitor_id);