import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorData } from './useVisitorId';

type EventType = 'click' | 'navigation' | 'scroll' | 'engagement' | 'form' | 'session';

interface TrackEventOptions {
  eventType: EventType;
  eventName: string;
  eventData?: Record<string, unknown>;
  elementId?: string;
  elementText?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('tracking_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('tracking_session_id', sessionId);
  }
  return sessionId;
};

export function useEventTracking() {
  const sessionId = useRef(getSessionId());
  const sessionStart = useRef(Date.now());

  const trackEvent = useCallback(async (options: TrackEventOptions) => {
    // Skip if device is excluded from tracking
    if (localStorage.getItem('tracking_excluded') === 'true') return;
    
    try {
      // Get visitor identification data
      const visitorData = getVisitorData();
      
      await (supabase.from('user_events' as any) as any).insert({
        session_id: sessionId.current,
        event_type: options.eventType,
        event_name: options.eventName,
        event_data: options.eventData || null,
        page_path: window.location.pathname,
        element_id: options.elementId || null,
        element_text: options.elementText || null,
        visitor_id: visitorData.visitorId,
        fingerprint: visitorData.fingerprint,
      });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);

  // Track navigation
  const trackNavigation = useCallback((pageName: string) => {
    trackEvent({
      eventType: 'navigation',
      eventName: 'page_view',
      eventData: { page: pageName },
    });
  }, [trackEvent]);

  // Track button/link clicks
  const trackClick = useCallback((elementName: string, elementId?: string, additionalData?: Record<string, unknown>) => {
    trackEvent({
      eventType: 'click',
      eventName: elementName,
      elementId,
      eventData: additionalData,
    });
  }, [trackEvent]);

  // Track form submissions
  const trackFormSubmit = useCallback((formName: string, success: boolean, additionalData?: Record<string, unknown>) => {
    trackEvent({
      eventType: 'form',
      eventName: `form_${success ? 'success' : 'error'}`,
      eventData: { form: formName, success, ...additionalData },
    });
  }, [trackEvent]);

  // Track session end on page unload
  useEffect(() => {
    const handleUnload = () => {
      // Skip if device is excluded
      if (localStorage.getItem('tracking_excluded') === 'true') return;
      
      const sessionDuration = Math.round((Date.now() - sessionStart.current) / 1000);
      
      // Use sendBeacon for reliable tracking on page close
      const data = JSON.stringify({
        session_id: sessionId.current,
        event_type: 'session',
        event_name: 'session_end',
        event_data: { duration_seconds: sessionDuration },
        page_path: window.location.pathname,
      });

      navigator.sendBeacon(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_events`,
        new Blob([data], { type: 'application/json' })
      );
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return {
    trackEvent,
    trackNavigation,
    trackClick,
    trackFormSubmit,
  };
}

// Simpler hook for global click tracking
export function useGlobalClickTracking() {
  const { trackClick } = useEventTracking();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Track buttons
      const button = target.closest('button');
      if (button) {
        const buttonText = button.textContent?.trim().slice(0, 50) || 'unknown';
        const buttonId = button.id || button.getAttribute('data-track-id') || undefined;
        trackClick(`button_${buttonText}`, buttonId, { type: 'button' });
        return;
      }

      // Track links
      const link = target.closest('a');
      if (link) {
        const linkText = link.textContent?.trim().slice(0, 50) || 'unknown';
        const href = link.getAttribute('href') || '';
        trackClick(`link_${linkText}`, link.id || undefined, { type: 'link', href });
        return;
      }

      // Track nav items
      const navItem = target.closest('[data-track]');
      if (navItem) {
        const trackName = navItem.getAttribute('data-track') || 'unknown';
        trackClick(trackName, navItem.id || undefined, { type: 'tracked_element' });
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [trackClick]);
}
