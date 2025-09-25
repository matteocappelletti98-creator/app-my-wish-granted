import { Link } from "react-router-dom";
import { ArrowLeft, Shield, User, Bell, Globe, Palette } from "lucide-react";

export default function Impostazioni() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
          <h1 className="text-4xl font-extralight text-blue-900 mb-2 tracking-wide">
            Impostazioni
          </h1>
          <p className="text-blue-700/70 font-light">
            Gestisci le tue preferenze e impostazioni dell'account
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Privacy */}
          <Link to="/privacy" className="group">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900">Privacy</h3>
                  <p className="text-blue-600/70 text-sm">Gestisci i tuoi consensi</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Account */}
          <div className="group cursor-pointer">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900">Account</h3>
                  <p className="text-blue-600/70 text-sm">Informazioni personali</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifiche */}
          <div className="group cursor-pointer">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900">Notifiche</h3>
                  <p className="text-blue-600/70 text-sm">Preferenze di notifica</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lingua */}
          <div className="group cursor-pointer">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900">Lingua</h3>
                  <p className="text-blue-600/70 text-sm">Preferenze linguistiche</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tema */}
          <div className="group cursor-pointer">
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-white/50 hover:bg-white/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-blue-900">Tema</h3>
                  <p className="text-blue-600/70 text-sm">Aspetto dell'app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}