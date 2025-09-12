import { Link } from "react-router-dom";
import { Map, List, FileText, Route } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="px-6 py-8 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
            <span className="text-blue-600">📍</span>
            <span>explore</span>
          </div>
          <p className="text-blue-900/70 text-lg">Independent local guide</p>
          <div className="flex gap-4 justify-center mt-6">
            <button className="px-6 py-2 text-blue-600 font-medium">Accedi</button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-medium">Registrati</button>
          </div>
        </div>
      </header>

      {/* Main Navigation Grid */}
      <main className="px-6 pb-12">
        <div className="mx-auto max-w-4xl grid grid-cols-2 gap-6">
          
          {/* Virtual exploration */}
          <Link to="/virtual-exploration" className="group">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border hover:shadow-md transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Map className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Virtual exploration</h2>
            </div>
          </Link>

          {/* Luoghi (Lists) */}
          <Link to="/luoghi" className="group">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border hover:shadow-md transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <List className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Luoghi</h2>
            </div>
          </Link>

          {/* Blog */}
          <Link to="/blog" className="group">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border hover:shadow-md transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog</h2>
            </div>
          </Link>

          {/* Travelling path */}
          <Link to="/travelling-path" className="group">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border hover:shadow-md transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Route className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Travelling path</h2>
            </div>
          </Link>
        </div>

        {/* My.explore section */}
        <div className="mx-auto max-w-4xl mt-12">
          <Link to="/add-place" className="group">
            <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <span className="text-blue-600 text-xl">📍</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">My.explore</h3>
                <p className="text-gray-600">Create your own guide</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}