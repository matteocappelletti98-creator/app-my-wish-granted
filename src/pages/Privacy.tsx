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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/impostazioni" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alle impostazioni
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-4xl font-extralight text-blue-900 tracking-wide">
                Privacy
              </h1>
              <p className="text-blue-700/70 font-light">
                Gestisci i tuoi consensi per la privacy
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Options */}
        <div className="space-y-6">
          {consentOptions.map((option) => (
            <div 
              key={option.key}
              className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:bg-white/80 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-blue-900">
                      {option.title}
                    </h3>
                    {option.required && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                        Obbligatorio
                      </span>
                    )}
                  </div>
                  <p className="text-blue-600/70 text-sm leading-relaxed">
                    {option.description}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <button
                    onClick={() => !option.required && handleConsentChange(option.key)}
                    disabled={option.required}
                    className={`w-16 h-8 rounded-full transition-all duration-300 flex items-center ${
                      consents[option.key]
                        ? 'bg-green-500 justify-end' 
                        : 'bg-gray-300 justify-start'
                    } ${option.required ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 mx-1 flex items-center justify-center ${
                      consents[option.key] ? 'translate-x-0' : ''
                    }`}>
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
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium tracking-wide hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:scale-105">
            Salva Preferenze
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50">
          <h4 className="font-medium text-blue-900 mb-3">Informazioni sui consensi</h4>
          <ul className="text-sm text-blue-700/70 space-y-2">
            <li>• I consensi obbligatori sono necessari per il funzionamento del servizio</li>
            <li>• Puoi modificare i tuoi consensi in qualsiasi momento</li>
            <li>• La revoca di alcuni consensi potrebbe limitare alcune funzionalità</li>
            <li>• I tuoi dati sono protetti secondo le normative GDPR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}