import { useState, useEffect } from 'react';

const VISITOR_ID_KEY = 'tl_visitor_id';
const FINGERPRINT_KEY = 'tl_fingerprint';

// Generate a unique visitor ID
const generateVisitorId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const randomPart2 = Math.random().toString(36).substring(2, 15);
  return `v_${timestamp}_${randomPart}${randomPart2}`;
};

// Generate a lightweight browser fingerprint
const generateFingerprint = (): string => {
  const components: string[] = [];
  
  // Screen properties
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);
  components.push(`${screen.pixelDepth || ''}`);
  
  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
  
  // Language
  components.push(navigator.language || '');
  
  // Platform
  components.push(navigator.platform || '');
  
  // Hardware concurrency (CPU cores)
  components.push(`${navigator.hardwareConcurrency || ''}`);
  
  // Device memory (if available)
  components.push(`${(navigator as any).deviceMemory || ''}`);
  
  // Touch support
  components.push(`${navigator.maxTouchPoints || 0}`);
  
  // Plugins count (legacy but useful)
  components.push(`${navigator.plugins?.length || 0}`);
  
  // WebGL renderer (if available)
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        components.push(renderer || '');
      }
    }
  } catch (e) {
    // Ignore WebGL errors
  }
  
  // Create a hash from components
  const fingerprint = components.join('|');
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `fp_${Math.abs(hash).toString(36)}`;
};

export interface VisitorData {
  visitorId: string;
  fingerprint: string;
  isReturning: boolean;
}

export const useVisitorId = (): VisitorData => {
  const [visitorData, setVisitorData] = useState<VisitorData>({
    visitorId: '',
    fingerprint: '',
    isReturning: false
  });

  useEffect(() => {
    // Check for existing visitor ID
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    let isReturning = false;
    
    if (visitorId) {
      isReturning = true;
    } else {
      visitorId = generateVisitorId();
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    
    // Generate fingerprint (regenerate each time for accuracy)
    const fingerprint = generateFingerprint();
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    
    setVisitorData({
      visitorId,
      fingerprint,
      isReturning
    });
  }, []);

  return visitorData;
};

// Standalone function to get visitor data (for use outside React components)
export const getVisitorData = (): VisitorData => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  let isReturning = false;
  
  if (visitorId) {
    isReturning = true;
  } else {
    visitorId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  
  const fingerprint = generateFingerprint();
  
  return {
    visitorId,
    fingerprint,
    isReturning
  };
};
