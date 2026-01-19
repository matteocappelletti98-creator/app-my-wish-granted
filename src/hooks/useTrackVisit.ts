import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTrackVisit() {
  useEffect(() => {
    const trackVisit = async () => {
      // Avoid tracking multiple times per session
      const hasTracked = sessionStorage.getItem('visit_tracked');
      if (hasTracked) return;

      try {
        await supabase.functions.invoke('track-visit', {
          body: {
            referrer: document.referrer || null,
            page_path: window.location.pathname,
          },
        });
        sessionStorage.setItem('visit_tracked', 'true');
        console.log('Visit tracked successfully');
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);
}
