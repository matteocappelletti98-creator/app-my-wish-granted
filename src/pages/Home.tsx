import { Link } from "react-router-dom";
import { MapPin, List, FileText, Star, Apple, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MapView from "@/components/MapView";
import { fetchPlacesFromSheet } from "@/lib/sheet";

export default function Home() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwPw96lY-Q5lZSwGy-cz4Fa2pVf_oo7YMZR2qlXPr8zPQaLZ9mJ8cU-3TaEYB0CWFYeMv2yvXU6FTr/pub?output=csv";
        const data = await fetchPlacesFromSheet(sheetUrl);
        const publishedPlaces = data.filter((p: any) => p.status?.toLowerCase() === "published");
        setPlaces(publishedPlaces);
      } catch (error) {
        console.error("Error loading places:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          <span className="text-2xl font-semibold text-blue-600">explore</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
              La tua guida indipendente per esplorare il mondo
            </h1>
            <p className="text-xl text-blue-700/70">
              Scopri luoghi autentici, crea la tua guida e vivi esperienze uniche.
            </p>
            
            {/* CTA Button */}
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Scarica l'App
            </Button>
            
            {/* App Store Badges */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors shadow-sm">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-blue-600/70">Scarica su</div>
                  <div className="text-sm font-semibold text-blue-900">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-white border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-50 transition-colors shadow-sm">
                <ShoppingBag className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-blue-600/70">Disponibile su</div>
                  <div className="text-sm font-semibold text-blue-900">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right - Phone Mockup with Map */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[320px] h-[640px] bg-gray-900 border-[14px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-20"></div>
              
              {/* Map Container */}
              <div className="h-full w-full relative overflow-hidden rounded-[2rem]">
                {!loading && places.length > 0 ? (
                  <div className="absolute inset-0">
                    <MapView 
                      places={places}
                      selectedCategories={[]}
                      className="h-full w-full rounded-[2rem]"
                    />
                  </div>
                ) : (
                  <div className="h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <MapPin className="w-20 h-20 text-blue-600 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">Esplora le destinazioni</h3>
            <p className="text-sm text-blue-700/70">prima di partire</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">Salva e organizza</h3>
            <p className="text-sm text-blue-700/70">i tuoi luoghi preferiti</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">Leggi articoli</h3>
            <p className="text-sm text-blue-700/70">e consigli autentici</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center">
              <List className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg text-blue-900">Crea la tua</h3>
            <p className="text-sm text-blue-700/70">guida personalizzata</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-blue-900 text-center mb-12">
          Cosa dicono i nostri viaggiatori
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/70 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Marco B.</h4>
                <p className="text-sm text-blue-600/70">Roma, Italia</p>
              </div>
            </div>
            <p className="text-blue-700/80">
              Utiqua varilittica per acopiri orgnaiare ca costei toscani
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Sarah T.</h4>
                <p className="text-sm text-blue-600/70">Milano, Italia</p>
              </div>
            </div>
            <p className="text-blue-700/80">
              La guida personalizzate sono eonaimemti dito di eu avoro blacigine!
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-teal-500"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Luca R.</h4>
                <p className="text-sm text-blue-600/70">Firenze, Italia</p>
              </div>
            </div>
            <p className="text-blue-700/80">
              enimncetstci ce a idigi-rmona ullli per vacaipare
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-blue-100 py-12 bg-white/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-semibold text-blue-600">explore</span>
            </div>
            <nav className="flex gap-8">
              <Link to="/privacy" className="text-blue-700/70 hover:text-blue-900 transition-colors">
                Privacy
              </Link>
              <a href="#contatti" className="text-blue-700/70 hover:text-blue-900 transition-colors">
                Contatti
              </a>
              <a href="#termini" className="text-blue-700/70 hover:text-blue-900 transition-colors">
                Termini
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}