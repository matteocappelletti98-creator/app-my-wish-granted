import { Link } from "react-router-dom";
import { Map, List, FileText, Footprints, Clock, Settings, ChevronDown, Instagram, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import trueLocalLogo from "@/assets/true-local-logo.png";
import homeHero from "@/assets/home-hero.png";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [hasIncompleteSurvey, setHasIncompleteSurvey] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Check for incomplete survey and show welcome popup on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      const totalQuestions = 11;
      const answeredQuestions = Object.keys(answers).length;
      setHasIncompleteSurvey(answeredQuestions > 0 && answeredQuestions < totalQuestions);
    }
    
    // Show welcome popup if user hasn't seen it
    const hasSeenWelcome = localStorage.getItem('true-local-welcome-seen');
    if (!hasSeenWelcome) {
      setWelcomeDialogOpen(true);
    }
  }, []);

  const handleWelcomeClose = () => {
    localStorage.setItem('true-local-welcome-seen', 'true');
    setWelcomeDialogOpen(false);
  };

  const languages = [
    { value: "it", label: "Italiano" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" }
  ];
  return (
    <div className="min-h-screen bg-white relative overflow-hidden pb-24">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 px-4 py-4">
        <div className="mx-auto max-w-md">
          {/* Top Bar: Auth Buttons and Settings */}
          <div className="flex justify-between items-center gap-2 mb-8">
            <div className="flex gap-2">
              <Link to="/auth">
                <button className="px-4 py-2 text-sm text-black font-dm-sans font-extralight tracking-wide hover:text-black/70 transition-colors active:scale-95">
                  Accedi
                </button>
              </Link>
              <Link to="/auth">
                <button className="px-4 py-2 text-sm text-black font-dm-sans font-extralight tracking-wide hover:text-black/70 transition-colors active:scale-95">
                  Registrati
                </button>
              </Link>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setContactDialogOpen(true)}
                className="px-3 py-2 text-sm text-black font-dm-sans font-extralight tracking-wide hover:text-black/70 transition-colors active:scale-95"
              >
                Contattaci
              </button>
              <Link to="/impostazioni">
                <button className="p-2 text-black hover:text-black/70 transition-colors active:scale-95">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* App Title - Removed */}
        </div>
      </header>

      {/* True Local Logo */}
      <div className="w-full flex justify-center mb-8">
        <img 
          src={trueLocalLogo} 
          alt="True Local - Be a traveler" 
          className="h-24 w-auto object-contain"
        />
      </div>


      {/* Hero Image - Click to enlarge */}
      <div className="w-full px-4 mb-6">
        <img 
          src={homeHero} 
          alt="True Local" 
          className="w-full h-48 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity active:scale-[0.98]"
          onClick={() => setImageDialogOpen(true)}
        />
      </div>

      {/* Image Fullscreen Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <img 
            src={homeHero} 
            alt="True Local" 
            className="w-full h-full object-contain"
            onClick={() => setImageDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Content Container */}
      <div className="relative z-10 px-4">
        <div className="mx-auto max-w-md">

          {/* Manifesto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-blue-100/50 text-center">
            <h2 className="text-xl md:text-2xl font-dm-sans font-extralight text-black leading-relaxed tracking-normal">
              {t('home.manifesto')}
            </h2>
            
            {/* Join Community Button */}
            <div className="mt-8">
              <Button
                onClick={() => window.open('https://www.instagram.com/truelocal_official/', '_blank')}
                className="bg-[#009fe3] hover:bg-[#0088c6] text-white font-dm-sans font-extralight px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Instagram className="w-6 h-6 mr-2" />
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-blue-100/50 rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bebas text-blue-900 tracking-wide text-center">
              HAI UN&apos;ATTIVITÀ?
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-blue-700/80 font-light leading-relaxed text-center pt-4">
              Hai un&apos;attività e lavori con gli stessi criteri della mission di true local: autenticità, qualità ed identità. Ma non sei presente nella guida? Contattaci e valuteremo il tuo ingresso, ricorda non siamo una guida pay to enter e non lo saremo mai! Quindi l&apos;ingresso è completamente gratuito.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="contact-name" className="text-blue-900 font-medium">Nome *</Label>
              <Input
                id="contact-name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Il tuo nome"
                className="mt-1 border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-email" className="text-blue-900 font-medium">Email *</Label>
              <Input
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="tua@email.com"
                className="mt-1 border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <div>
              <Label htmlFor="contact-message" className="text-blue-900 font-medium">Messaggio *</Label>
              <Textarea
                id="contact-message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder="Raccontaci della tua attività..."
                rows={4}
                className="mt-1 border-blue-200 focus:border-blue-400"
              />
            </div>
            
            <Button 
              onClick={() => {
                // TODO: Implementare invio email
                console.log({ contactName, contactEmail, contactMessage });
                setContactDialogOpen(false);
                setContactName("");
                setContactEmail("");
                setContactMessage("");
              }}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              disabled={!contactName || !contactEmail || !contactMessage}
            >
              <Send className="w-4 h-4" />
              Invia Messaggio
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Welcome Popup Dialog */}
      <Dialog open={welcomeDialogOpen} onOpenChange={(open) => !open && handleWelcomeClose()}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-blue-100/50 rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-dm-sans font-medium text-blue-900 text-center">
              Ciao 👋
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed font-dm-sans">
            <p>
              Grazie per essere qui!
            </p>
            <p>
              <strong>True Local</strong> sarà un'app mobile con lo scopo di raccontare, scoprire e valorizzare il nostro territorio nella sua traccia più vera.
            </p>
            <p>
              Questo che stai visualizzando è un <strong>prototipo</strong>. Ha tanti difetti, non sarà il prodotto definitivo.
            </p>
            <p>
              Il suo scopo è quello di raccogliere informazioni rispetto a quello che un utente potrebbe volere da True Local.
            </p>
            <p>
              Un team di sviluppatori è infatti proprio in questo momento al lavoro sull'app originale ed è dunque importante per noi capire ora se ci sono dei difetti strutturali nella impalcatura concettuale di True Local.
            </p>
            <p className="font-medium text-blue-700">
              PS: suggeriscici i tuoi luoghi preferiti! 📍
            </p>
            <p className="text-right text-gray-600 italic">
              Grazie.<br/>
              Matteo
            </p>
          </div>
          
          <Button 
            onClick={handleWelcomeClose}
            className="w-full mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all"
          >
            Ho capito, esplora!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}