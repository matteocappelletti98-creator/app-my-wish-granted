import { useState } from "react";
import { MapPin, Send, Loader2, ChevronDown, ChevronRight, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import trueLocalApproved from "@/assets/true-local-approved.png";

interface SuggestPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Traveller Path questions structure
const travellerPathCategories = [
  {
    id: "profile",
    name: "Profilo",
    options: [
      { code: 1, label: "Local" },
      { code: 2, label: "Viaggiatore" },
      { code: 3, label: "Uomo" },
      { code: 4, label: "Donna" },
      { code: 5, label: "Altro genere" },
      { code: 6, label: "< 18 anni" },
      { code: 7, label: "18-24 anni" },
      { code: 8, label: "25-34 anni" },
      { code: 9, label: "35-49 anni" },
      { code: 10, label: "50-64 anni" },
      { code: 11, label: "> 64 anni" },
    ]
  },
  {
    id: "interests",
    name: "Interessi",
    options: [
      { code: 12, label: "Avventura" },
      { code: 13, label: "Relax" },
      { code: 14, label: "Cultura" },
      { code: 15, label: "Shopping" },
      { code: 16, label: "Night life" },
      { code: 17, label: "Foodie" },
      { code: 18, label: "Lusso" },
    ]
  },
  {
    id: "cuisine",
    name: "Cucina",
    options: [
      { code: 19, label: "Tradizionale" },
      { code: 20, label: "Alta cucina" },
      { code: 21, label: "Fusion" },
      { code: 22, label: "Wine pairing" },
      { code: 23, label: "Street food" },
      { code: 24, label: "Vegana" },
      { code: 25, label: "Vegetariana" },
      { code: 26, label: "Senza glutine" },
      { code: 27, label: "Biologico" },
      { code: 28, label: "Pesce" },
      { code: 29, label: "Carne" },
      { code: 30, label: "Brunch spot" },
      { code: 31, label: "Quick Bite" },
    ]
  },
  {
    id: "origin",
    name: "Provenienza",
    options: [
      { code: 32, label: "Europa" },
      { code: 33, label: "Nord America" },
      { code: 34, label: "Sud America" },
      { code: 35, label: "Asia" },
      { code: 36, label: "Africa" },
      { code: 37, label: "Medio Oriente" },
      { code: 38, label: "Oceania" },
    ]
  },
  {
    id: "budget",
    name: "Budget",
    options: [
      { code: 39, label: "Basso" },
      { code: 40, label: "Medio" },
      { code: 41, label: "Premium" },
    ]
  },
  {
    id: "duration",
    name: "Durata soggiorno",
    options: [
      { code: 42, label: "1 giorno" },
      { code: 43, label: "2 giorni" },
      { code: 44, label: "3-7 giorni" },
      { code: 45, label: "> 7 giorni" },
    ]
  },
  {
    id: "composition",
    name: "Composizione gruppo",
    options: [
      { code: 46, label: "Solo" },
      { code: 47, label: "Coppia" },
      { code: 48, label: "Gruppo" },
      { code: 49, label: "Famiglia" },
    ]
  },
  {
    id: "transport",
    name: "Trasporto",
    options: [
      { code: 50, label: "Proprio" },
      { code: 51, label: "Nessuno" },
      { code: 52, label: "Noleggio" },
    ]
  },
];

export function SuggestPlaceDialog({ open, onOpenChange }: SuggestPlaceDialogProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    placeName: "",
    city: "",
    description: "",
    senderName: "",
  });
  const [selectedTpCodes, setSelectedTpCodes] = useState<number[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [showTpSection, setShowTpSection] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTpCode = (code: number) => {
    setSelectedTpCodes(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const handleSubmit = async () => {
    if (!formData.placeName || !formData.city || !formData.senderName) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-suggestion", {
        body: {
          ...formData,
          tpCodes: selectedTpCodes.length > 0 ? selectedTpCodes : undefined,
        },
      });

      if (error) throw error;

      toast.success("Grazie! Il tuo suggerimento è stato inviato 🎉");
      setFormData({
        placeName: "",
        city: "",
        description: "",
        senderName: "",
      });
      setSelectedTpCodes([]);
      setOpenCategories([]);
      setShowTpSection(false);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error sending suggestion:", error);
      toast.error("Errore nell'invio. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/95 backdrop-blur-sm border-blue-100/50 rounded-2xl max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center">
          <img 
            src={trueLocalApproved} 
            alt="True Local Approved" 
            className="w-24 h-auto mb-2"
          />
          <DialogTitle className="text-2xl font-bebas text-[#1a5a7a] tracking-wide text-center flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6" />
            SUGGERISCI UN LUOGO
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 font-light leading-relaxed text-center pt-2">
            Conosci un posto autentico che merita di essere nella guida? Raccontacelo!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="place-name" className="text-[#1a5a7a] font-medium">
              Nome del luogo *
            </Label>
            <Input
              id="place-name"
              value={formData.placeName}
              onChange={(e) => setFormData({ ...formData, placeName: e.target.value })}
              placeholder="Es. Trattoria Da Mario"
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-[#1a5a7a] font-medium">
              Città *
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Es. Como, Lecco, Milano..."
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="sender-name" className="text-[#1a5a7a] font-medium">
              Il tuo nome *
            </Label>
            <Input
              id="sender-name"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              placeholder="Il tuo nome"
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1a5a7a] font-medium">
              Se vuoi dicci perché lo consigli
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Raccontaci cosa lo rende speciale..."
              rows={3}
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          {/* Traveller Path Section */}
          <Collapsible open={showTpSection} onOpenChange={setShowTpSection}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-[#e6f7fd] to-[#f0faff] rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#009fe3]" />
                  <span className="font-medium text-[#1a5a7a]">Traveller Path</span>
                  {selectedTpCodes.length > 0 && (
                    <span className="bg-[#009fe3] text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedTpCodes.length}
                    </span>
                  )}
                </div>
                {showTpSection ? (
                  <ChevronDown className="w-5 h-5 text-[#009fe3]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#009fe3]" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              <p className="text-xs text-gray-500 px-1">
                Seleziona i profili di viaggiatori / local a cui questo luogo è più adatto
              </p>
              {travellerPathCategories.map((category) => (
                <Collapsible
                  key={category.id}
                  open={openCategories.includes(category.id)}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <button className="w-full flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <div className="flex items-center gap-2">
                        {category.options.filter(opt => selectedTpCodes.includes(opt.code)).length > 0 && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded">
                            {category.options.filter(opt => selectedTpCodes.includes(opt.code)).length}
                          </span>
                        )}
                        {openCategories.includes(category.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 ml-2 space-y-1">
                    {category.options.map((option) => (
                      <label
                        key={option.code}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={selectedTpCodes.includes(option.code)}
                          onCheckedChange={() => toggleTpCode(option.code)}
                          className="border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.placeName || !formData.city || !formData.senderName}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#288cbd] to-[#1a5a7a] hover:from-[#2499d1] hover:to-[#1e6a8f] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Invio in corso...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Invia Suggerimento
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
