import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorData } from './useVisitorId';

export function useTrackVisit() {
  useEffect(() => {
    const trackVisit = async () => {
      // Skip if device is excluded from tracking
      if (localStorage.getItem('tracking_excluded') === 'true') return;
      
      // Avoid tracking multiple times per session
      const hasTracked = sessionStorage.getItem('visit_tracked');
      if (hasTracked) return;

      try {
        // Get visitor identification data
        const visitorData = getVisitorData();
        
        await supabase.functions.invoke('track-visit', {
          body: {
            referrer: document.referrer || null,
            page_path: window.location.pathname,
            visitor_id: visitorData.visitorId,
            fingerprint: visitorData.fingerprint,
            is_returning: visitorData.isReturning,
          },
        });
        sessionStorage.setItem('visit_tracked', 'true');
        console.log('Visit tracked successfully with visitor ID:', visitorData.visitorId);
      } catch (error) {
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);
}
