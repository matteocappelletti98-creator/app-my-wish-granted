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
import homeBg from "@/assets/home-bg.png";

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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${homeBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

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