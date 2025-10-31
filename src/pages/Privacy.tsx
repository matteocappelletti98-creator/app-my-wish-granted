import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Check, X } from "lucide-react";
import { useState } from "react";

export default function Privacy() {
  const [consents, setConsents] = useState({
    personalData: true,
    marketing: false,
    analytics: true,
    cookies: true,
    thirdParty: false,
    newsletter: false,
    locationData: true
  });

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const consentOptions = [
    {
      key: 'personalData' as keyof typeof consents,
      title: 'Dati Personali',
      description: 'Consenso per l\'elaborazione dei dati personali per il funzionamento del servizio',
      required: true
    },
    {
      key: 'analytics' as keyof typeof consents,
      title: 'Analytics',
      description: 'Raccolta dati anonimi per migliorare l\'esperienza utente',
      required: false
    },
    {
      key: 'cookies' as keyof typeof consents,
      title: 'Cookies Tecnici',
      description: 'Utilizzo di cookies necessari per il funzionamento del sito',
      required: true
    },
    {
      key: 'marketing' as keyof typeof consents,
      title: 'Marketing',
      description: 'Invio di comunicazioni promozionali e offerte personalizzate',
      required: false
    },
    {
      key: 'newsletter' as keyof typeof consents,
      title: 'Newsletter',
      description: 'Ricezione di newsletter con aggiornamenti e novità',
      required: false
    },
    {
      key: 'thirdParty' as keyof typeof consents,
      title: 'Servizi Terze Parti',
      description: 'Condivisione dati con partner per servizi aggiuntivi',
      required: false
    },
    {
      key: 'locationData' as keyof typeof consents,
      title: 'Dati di Geolocalizzazione',
      description: 'Utilizzo della posizione per suggerimenti personalizzati',
      required: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/impostazioni" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Indietro</span>
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extralight text-blue-900 tracking-wide">
                  Privacy & Cookies
                </h1>
                <p className="text-blue-700/70 font-light text-sm">
                  Gestisci i tuoi consensi
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Options */}
          <div className="space-y-3">
            {consentOptions.map((option) => (
              <div 
                key={option.key}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/50 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-base font-medium text-blue-900">
                        {option.title}
                      </h3>
                      {option.required && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                          Obbligatorio
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600/70 text-xs leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => !option.required && handleConsentChange(option.key)}
                      disabled={option.required}
                      className={`w-14 h-7 rounded-full transition-all duration-300 flex items-center ${
                        consents[option.key]
                          ? 'bg-green-500 justify-end' 
                          : 'bg-gray-300 justify-start'
                      } ${option.required ? 'opacity-75' : 'active:scale-95'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 mx-1 flex items-center justify-center`}>
                        {consents[option.key] ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <X className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <button className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95">
              Salva Preferenze
            </button>
          </div>

          {/* Info Section */}
          <div className="mt-6 bg-blue-50/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-100/50">
            <h4 className="font-medium text-blue-900 mb-3 text-sm">Informazioni sui consensi</h4>
            <ul className="text-xs text-blue-700/70 space-y-2">
              <li>• I consensi obbligatori sono necessari per il funzionamento</li>
              <li>• Puoi modificare i tuoi consensi in qualsiasi momento</li>
              <li>• La revoca potrebbe limitare alcune funzionalità</li>
              <li>• I tuoi dati sono protetti secondo le normative GDPR</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}