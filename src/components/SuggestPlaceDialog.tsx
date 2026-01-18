import { useState } from "react";
import { MapPin, Send, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import trueLocalApproved from "@/assets/true-local-approved.png";

interface SuggestPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const placeCategories = [
  { value: "ristorante", label: "Ristorante" },
  { value: "bar", label: "Bar / Caffè" },
  { value: "hotel", label: "Hotel / B&B" },
  { value: "negozio", label: "Negozio" },
  { value: "attrazione", label: "Attrazione" },
  { value: "natura", label: "Natura / Panorama" },
  { value: "sport", label: "Sport / Attività" },
  { value: "altro", label: "Altro" },
];

export function SuggestPlaceDialog({ open, onOpenChange }: SuggestPlaceDialogProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    placeName: "",
    placeType: "",
    location: "",
    description: "",
    senderName: "",
  });

  const handleSubmit = async () => {
    if (!formData.placeName || !formData.senderName) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-suggestion", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Grazie! Il tuo suggerimento è stato inviato 🎉");
      setFormData({
        placeName: "",
        placeType: "",
        location: "",
        description: "",
        senderName: "",
      });
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
            className="w-20 h-20 mb-2"
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
            <Label htmlFor="place-type" className="text-[#1a5a7a] font-medium">
              Categoria
            </Label>
            <Select
              value={formData.placeType}
              onValueChange={(value) => setFormData({ ...formData, placeType: value })}
            >
              <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                {placeCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Label htmlFor="location" className="text-[#1a5a7a] font-medium">
              Posizione / Indirizzo
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Es. Via Roma 15, Bellagio"
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#1a5a7a] font-medium">
              Perché lo consigli?
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

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.placeName || !formData.senderName}
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
