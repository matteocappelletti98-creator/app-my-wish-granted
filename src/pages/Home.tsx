import { Link } from "react-router-dom";
import { Map, List, FileText, Route, MapPin, Globe, Info } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("it");
  
  const cities = [
    { value: "como", label: "Como" },
    { value: "milano", label: "Milano" },
    { value: "bergamo", label: "Bergamo" },
    { value: "torino", label: "Torino" },
    { value: "venezia", label: "Venezia" }
  ];

  const languages = [
    { value: "it", label: "Italiano" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-6xl md:text-7xl font-extralight text-blue-900 mb-4 tracking-wider">
              explore
            </h1>
            <p className="text-xl text-blue-700/70 font-light tracking-wide mb-8">Independent local guide</p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
          </div>
          
          <div className="flex gap-8 justify-center items-center mb-12">
            <button className="px-10 py-4 text-blue-600 font-medium tracking-wide hover:text-blue-800 transition-all duration-300 hover:scale-105">
              Accedi
            </button>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium tracking-wide hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105">
              Registrati
            </button>
            <button className="px-8 py-4 text-blue-600 font-medium tracking-wide hover:text-blue-800 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Chi siamo?
            </button>
          </div>

          {/* Selectors Container */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* City Selector */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-900">Seleziona città</h3>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-light"
              >
                <option value="">Tutte le città</option>
                {cities.map(city => (
                  <option key={city.value} value={city.value}>{city.label}</option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-medium text-blue-900">Seleziona lingua</h3>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border border-blue-100 rounded-xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-light"
              >
                {languages.map(language => (
                  <option key={language.value} value={language.value}>{language.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Grid */}
      <main className="relative z-10 px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          
          {/* Navigation Grid Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            
            {/* Virtual exploration */}
            <Link to="/virtual-exploration" className="group">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Map className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-light text-blue-900 tracking-wide mb-2">Virtual exploration</h2>
                  <p className="text-blue-600/70 font-light text-sm">Esplora luoghi sulla mappa</p>
                </div>
              </div>
            </Link>

            {/* Luoghi */}
            <Link to="/luoghi" className="group">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <List className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-light text-blue-900 tracking-wide mb-2">Luoghi</h2>
                  <p className="text-blue-600/70 font-light text-sm">Scopri tutti i luoghi</p>
                </div>
              </div>
            </Link>

            {/* Blog */}
            <Link to="/blog" className="group">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FileText className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-light text-blue-900 tracking-wide mb-2">Blog</h2>
                  <p className="text-blue-600/70 font-light text-sm">Articoli e guide</p>
                </div>
              </div>
            </Link>

            {/* Traveller Path */}
            <Link to="/traveller-path" className="group">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <Route className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-light text-blue-900 tracking-wide mb-2">Traveller.Path</h2>
                  <p className="text-blue-600/70 font-light text-sm">Itinerari personalizzati</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Bottom Message Enhanced */}
          <div className="text-center">
            <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-12 border border-white/40 max-w-3xl mx-auto shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/30 to-purple-50/30"></div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-extralight text-blue-900 mb-4 tracking-wide">
                  Which city will next?
                </h3>
                <p className="text-blue-700/70 font-light tracking-wide text-lg">
                  Stay tuned my friends
                </p>
                <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}