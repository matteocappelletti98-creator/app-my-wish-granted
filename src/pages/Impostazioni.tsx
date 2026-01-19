import { Link } from "react-router-dom";
import { ArrowLeft, Shield, User, Globe, BarChart3, MapPin } from "lucide-react";

export default function Impostazioni() {
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
              to="/" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Indietro</span>
            </Link>
            <h1 className="text-4xl font-extralight text-blue-900 mb-2 tracking-wide">
              Impostazioni
            </h1>
            <p className="text-blue-700/70 font-light text-sm">
              Gestisci le tue preferenze
            </p>
          </div>

          {/* Settings List */}
          <div className="space-y-3">
            
            {/* Privacy */}
            <Link to="/privacy">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg transition-all active:scale-95">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-blue-900">Privacy & Cookies</h3>
                    <p className="text-blue-600/70 text-sm">Gestisci i tuoi consensi</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Account */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg transition-all active:scale-95">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-blue-900">Account</h3>
                  <p className="text-blue-600/70 text-sm">Informazioni personali</p>
                </div>
              </div>
            </div>

            {/* Lingua */}
            <Link to="/lingua">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg transition-all active:scale-95">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-blue-900">Lingua</h3>
                    <p className="text-blue-600/70 text-sm">Preferenze linguistiche</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Analytics */}
            <Link to="/analytics">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg transition-all active:scale-95">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-blue-900">Analytics</h3>
                    <p className="text-blue-600/70 text-sm">Statistiche visite app</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin Città */}
            <Link to="/admin/cities">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/50 active:bg-white/90 shadow-lg transition-all active:scale-95">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-blue-900">Gestione Città</h3>
                    <p className="text-blue-600/70 text-sm">Big POI City admin</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}