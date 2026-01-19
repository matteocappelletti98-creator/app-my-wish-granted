-- Create table for tracking app visits
CREATE TABLE public.app_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  city TEXT,
  country TEXT,
  referrer TEXT,
  user_agent TEXT,
  page_path TEXT
);

-- Enable RLS but allow inserts from edge function
ALTER TABLE public.app_visits ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts (from edge function with service role)
CREATE POLICY "Allow anonymous inserts" 
ON public.app_visits 
FOR INSERT 
WITH CHECK (true);

-- Policy to allow reads (for admin dashboard)
CREATE POLICY "Allow reads for authenticated users" 
ON public.app_visits 
FOR SELECT 
USING (true);