import { Link } from "react-router-dom";
import { MapPin, List, FileText, Star, Apple, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <span className="text-2xl font-semibold text-primary">explore</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
              La tua guida indipendente per esplorare il mondo
            </h1>
            <p className="text-xl text-muted-foreground">
              Scopri luoghi autentici, crea la tua guida e vivi esperienze uniche.
            </p>
            
            {/* CTA Button */}
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
              Scarica l'App
            </Button>
            
            {/* App Store Badges */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/50 transition-colors">
                <Apple className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Scarica su</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:bg-muted/50 transition-colors">
                <ShoppingBag className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground">Disponibile su</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Right - Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[300px] h-[600px] bg-card border-8 border-foreground rounded-[3rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-foreground rounded-b-3xl"></div>
              <div className="h-full bg-gradient-to-br from-ocean-blue/20 to-nature-green/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-20 h-20 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">App Screenshot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Esplora le destinazioni</h3>
            <p className="text-sm text-muted-foreground">prima di partiire</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Salva e organizza</h3>
            <p className="text-sm text-muted-foreground">i tuoi luoghi preferiti</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Leggi articoli</h3>
            <p className="text-sm text-muted-foreground">e consigli autentici</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <List className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Crea la tua</h3>
            <p className="text-sm text-muted-foreground">guida personalizzata</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-primary text-center mb-12">
          Cosa dicono i nostri viaggiatori
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nature-green to-ocean-blue"></div>
              <div>
                <h4 className="font-semibold">Marco B.</h4>
                <p className="text-sm text-muted-foreground">Roma, Italia</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Utiqua varilittica per acopiri orgnaiare ca costei toscani
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sunset-orange to-accent"></div>
              <div>
                <h4 className="font-semibold">Sarah T.</h4>
                <p className="text-sm text-muted-foreground">Milano, Italia</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              La guida personalizzate sono eonaimemti dito di eu avoro blacigine!
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-blue to-nature-green"></div>
              <div>
                <h4 className="font-semibold">Luca R.</h4>
                <p className="text-sm text-muted-foreground">Firenze, Italia</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              enimncetstci ce a idigi-rmona ullli per vacaipare
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold text-primary">explore</span>
            </div>
            <nav className="flex gap-8">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <a href="#contatti" className="text-muted-foreground hover:text-foreground transition-colors">
                Contatti
              </a>
              <a href="#termini" className="text-muted-foreground hover:text-foreground transition-colors">
                Termini
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}