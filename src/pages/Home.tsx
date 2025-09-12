import { Link } from "react-router-dom";
import { Map, List, FileText, Route } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30">
      {/* Header */}
      <header className="px-6 py-12 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-5xl font-light text-blue-900 mb-3 tracking-wide">
              explore
            </h1>
            <p className="text-lg text-blue-700/70 font-light tracking-wide">Independent local guide</p>
          </div>
          
          <div className="flex gap-6 justify-center">
            <button className="px-8 py-3 text-blue-600 font-medium tracking-wide hover:text-blue-800 transition-colors">
              Accedi
            </button>
            <button className="px-8 py-3 bg-blue-600 text-white font-medium tracking-wide hover:bg-blue-700 transition-colors rounded-2xl">
              Registrati
            </button>
          </div>
        </div>
      </header>

      {/* Main Navigation Grid */}
      <main className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          
          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-8 mb-16">
            
            {/* Virtual exploration */}
            <Link to="/virtual-exploration" className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-blue-100/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50/80 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Map className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-light text-blue-900 tracking-wide">Virtual exploration</h2>
              </div>
            </Link>

            {/* Luoghi */}
            <Link to="/luoghi" className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-blue-100/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50/80 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <List className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-light text-blue-900 tracking-wide">Luoghi</h2>
              </div>
            </Link>

            {/* Blog */}
            <Link to="/blog" className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-blue-100/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50/80 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <FileText className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-light text-blue-900 tracking-wide">Blog</h2>
              </div>
            </Link>

            {/* Travelling path */}
            <Link to="/travelling-path" className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center border border-blue-100/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-20 h-20 mx-auto mb-6 bg-blue-50/80 rounded-2xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Route className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-light text-blue-900 tracking-wide">Travelling path</h2>
              </div>
            </Link>
          </div>

          {/* Bottom Message */}
          <div className="text-center">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/30 max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-blue-900 mb-2 tracking-wide">
                Which city will next?
              </h3>
              <p className="text-blue-700/70 font-light tracking-wide">
                Stay tuned my friends
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}