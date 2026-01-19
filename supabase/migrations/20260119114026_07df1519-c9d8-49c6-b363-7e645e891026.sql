-- Create user events tracking table
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_data JSONB,
  page_path TEXT,
  element_id TEXT,
  element_text TEXT
);

-- Enable RLS
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous event inserts" 
ON public.user_events 
FOR INSERT 
WITH CHECK (true);

-- Allow reads for analytics (authenticated or service role)
CREATE POLICY "Allow reads for analytics" 
ON public.user_events 
FOR SELECT 
USING (true);

-- Add index for common queries
CREATE INDEX idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX idx_user_events_created_at ON public.user_events(created_at DESC);
CREATE INDEX idx_user_events_session_id ON public.user_events(session_id);