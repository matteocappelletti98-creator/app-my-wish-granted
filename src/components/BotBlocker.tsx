import { useEffect, useState } from 'react';
import { Shield, Bot } from 'lucide-react';

// Bot detection patterns - Only detect obvious bots, not old browsers
const BOT_PATTERNS = {
  // Known bot user agents
  knownBots: /bot|crawler|spider|scraper|headless|phantom|selenium|puppeteer|playwright/i,
  // Suspicious patterns (automated tools)
  suspicious: /curl|wget|python-requests|java\/|ruby|perl|php|go-http|node-fetch/i,
};

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
  
  // Note: Removed "fake Chrome" check as it caused false positives
  // on legitimate browsers like Brave, Edge, and mobile Chrome
  
  return false;
};

interface BotBlockerProps {
  children: React.ReactNode;
}

export function BotBlocker({ children }: BotBlockerProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Small delay to let browser APIs initialize
    const timer = setTimeout(() => {
      const detected = isBot();
      setIsBlocked(detected);
      setChecking(false);
      
      if (detected) {
        console.log('Access blocked: bot detected');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Accesso Bloccato
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <Bot className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 text-sm">Bot rilevato</span>
          </div>
          
          <p className="text-gray-600 mb-6">
            Questo sito è riservato agli utenti reali. 
            L'accesso automatizzato non è consentito.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
            <p>Se ritieni che questo sia un errore, contattaci.</p>
            <p className="mt-2 font-mono text-gray-400">
              Ref: {new Date().toISOString().slice(0, 10)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
