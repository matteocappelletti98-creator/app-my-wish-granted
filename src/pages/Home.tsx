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
import valeoSponsor from "@/assets/valeo-sponsor.jpg";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [hasIncompleteSurvey, setHasIncompleteSurvey] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Check for incomplete survey on component mount
  useEffect(() => {
    const savedAnswers = localStorage.getItem('traveller-path-answers');
    if (savedAnswers) {
      const answers = JSON.parse(savedAnswers);
      const totalQuestions = 11;
      const answeredQuestions = Object.keys(answers).length;
      setHasIncompleteSurvey(answeredQuestions > 0 && answeredQuestions < totalQuestions);
    }
  }, []);

  const languages = [
    { value: "it", label: "Italiano" },
    { value: "en", label: "English" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "es", label: "Español" }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header - Mobile Optimized */}
      <header className="relative z-10 px-4 py-4">
        <div className="mx-auto max-w-md">
          {/* Top Bar: Auth Buttons and Settings */}
          <div className="flex justify-between items-center gap-2 mb-8">
            <div className="flex gap-2">
              <Link to="/auth">
                <button className="px-4 py-2 text-sm text-blue-900 font-bebas tracking-wide hover:text-blue-800 transition-colors active:scale-95">
                  Accedi
                </button>
              </Link>
              <Link to="/auth">
                <button className="px-4 py-2 text-sm bg-blue-900 text-white font-bebas tracking-wide rounded-xl hover:bg-blue-800 transition-all active:scale-95">
                  Registrati
                </button>
              </Link>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setContactDialogOpen(true)}
                className="px-3 py-2 text-sm text-blue-900 font-bebas tracking-wide hover:text-blue-600 transition-colors active:scale-95"
              >
                Contattaci
              </button>
              <Link to="/impostazioni">
                <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors active:scale-95">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-6">
            <h1 className="text-6xl font-bebas font-normal text-blue-900 mb-3 tracking-wider">
              TRUE LOCAL
            </h1>
            <p className="text-base text-blue-900 font-bebas tracking-wide mb-4">discover the city</p>
          </div>

          {/* Sponsor Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-blue-100/50 text-center mb-6">
            <p className="text-sm text-blue-900 font-bebas tracking-wide mb-4">Official Sponsor</p>
            <img 
              src={valeoSponsor} 
              alt="Valeo Digital SA" 
              className="w-48 h-auto mx-auto"
            />
          </div>

          {/* Manifesto */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-blue-100/50 text-center">
            <h2 className="text-3xl md:text-4xl font-bebas font-normal text-blue-900 leading-tight tracking-wide">
              WE'VE MAPPED THE BEST OF COMO — EXPLORE, CREATE YOUR OWN GUIDE, READ OUR TIPS, DISCOVER THE TRAVELER PATH.
            </h2>
            <div className="mt-6 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
            
            {/* Join Community Button */}
            <div className="mt-8">
              <Button
                onClick={() => window.open('https://www.instagram.com/truelocalcomo/', '_blank')}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Instagram className="w-6 h-6 mr-2" />
                Join the Community
              </Button>
            </div>
          </div>
        </div>
      </header>

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
    </div>
  );
}