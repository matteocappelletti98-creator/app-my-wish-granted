import { useEffect, useState, useRef } from 'react';
import { Shield, Bot, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorData } from '@/hooks/useVisitorId';

// Bot detection patterns - Only detect obvious bots, not old browsers
const BOT_PATTERNS = {
  // Known bot user agents
  knownBots: /bot|crawler|spider|scraper|headless|phantom|selenium|puppeteer|playwright/i,
  // Suspicious patterns (automated tools)
  suspicious: /curl|wget|python-requests|java\/|ruby|perl|php|go-http|node-fetch/i,
};

const HUMAN_VERIFIED_KEY = 'tl_human_verified';

const isBot = (): boolean => {
  const ua = navigator.userAgent;
  
  // Check for known bot identifiers
  if (BOT_PATTERNS.knownBots.test(ua)) {
    console.log('Bot detected: known bot pattern');
    return true;
  }
  
  // Check for suspicious request patterns
  if (BOT_PATTERNS.suspicious.test(ua)) {
    console.log('Bot detected: suspicious pattern');
    return true;
  }
  
  // Check for headless browser indicators
  if ((navigator as any).webdriver) {
    console.log('Bot detected: webdriver present');
    return true;
  }
  
  return false;
};

// Track bot blocker events
const trackBotBlockerEvent = async (eventName: string) => {
  try {
    const visitorData = getVisitorData();
    await (supabase.from('user_events' as any) as any).insert({
      event_type: 'engagement',
      event_name: eventName,
      page_path: window.location.pathname,
      visitor_id: visitorData.visitorId,
      fingerprint: visitorData.fingerprint,
      event_data: { user_agent: navigator.userAgent },
    });
  } catch (error) {
    console.error('Failed to track bot blocker event:', error);
  }
};

interface BotBlockerProps {
  children: React.ReactNode;
}

export function BotBlocker({ children }: BotBlockerProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [verified, setVerified] = useState(false);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    // Check if user was already verified
    const wasVerified = localStorage.getItem(HUMAN_VERIFIED_KEY) === 'true';
    if (wasVerified) {
      setVerified(true);
      setChecking(false);
      return;
    }

    // Small delay to let browser APIs initialize
    const timer = setTimeout(() => {
      const detected = isBot();
      setIsBlocked(detected);
      setChecking(false);
      
      if (detected) {
        console.log('Bot check triggered - showing verification');
        // Track that the verification screen was shown
        if (!hasTrackedView.current) {
          hasTrackedView.current = true;
          trackBotBlockerEvent('bot_verification_shown');
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleVerify = () => {
    // Track that the button was clicked
    trackBotBlockerEvent('bot_verification_clicked');
    
    localStorage.setItem(HUMAN_VERIFIED_KEY, 'true');
    setVerified(true);
    setIsBlocked(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isBlocked && !verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-amber-100">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-amber-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Verifica di Sicurezza
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 text-sm">Controllo automatico</span>
          </div>
          
          <p className="text-gray-600 mb-6">
            Per proteggere il sito da accessi automatizzati, 
            conferma di essere un utente reale.
          </p>
          
          <Button 
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg rounded-xl shadow-lg"
          >
            <UserCheck className="w-5 h-5 mr-2" />
            Non sono un robot
          </Button>
          
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 mt-6">
            <p>Questa verifica è richiesta una sola volta.</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
