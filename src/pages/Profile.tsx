import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Heart, Plus, X, Mail, Download } from "lucide-react";
import { toast } from "sonner";
import { fetchPlacesFromSheet, Place } from "@/lib/sheet";
import MapView from "@/components/MapView";
import CategoryBadge, { normalizeCategory } from "@/components/CategoryBadge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CSV_URL = "https://docs.google.com/spreadsheets/d/1nMlIV3DaG2dOeSQ6o19pPP5OlpHW-atXr1fixKUG3bo/export?format=csv&gid=2050593337";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false);
  const [suggestionEmail, setSuggestionEmail] = useState("");
  const [suggestionName, setSuggestionName] = useState("");
  const [suggestionPlace, setSuggestionPlace] = useState("");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load all places
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchPlacesFromSheet(CSV_URL);
        setAllPlaces(data.filter(p => p.status === "published"));
      } catch (error) {
        console.error("Error loading places:", error);
      }
    };

    loadPlaces();
  }, []);

  // Load favorites (localStorage for non-logged users, database for logged users)
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // Load from database
        const { data, error } = await supabase
          .from("user_favorites")
          .select("place_id")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error loading favorites:", error);
        } else {
          setFavorites(data.map(f => f.place_id));
        }
      } else {
        // Load from localStorage
        const saved = localStorage.getItem('explore-favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
    };

    loadFavorites();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleFavorite = async (placeId: string) => {
    const isCurrentlyFavorite = favorites.includes(placeId);
    
    if (!user) {
      // Non-logged user: use localStorage
      const newFavorites = isCurrentlyFavorite
        ? favorites.filter(id => id !== placeId)
        : [...favorites, placeId];
      setFavorites(newFavorites);
      localStorage.setItem('explore-favorites', JSON.stringify(newFavorites));
      
      if (isCurrentlyFavorite) {
        toast.success("Rimosso dai preferiti");
      } else {
        toast.success("Aggiunto ai preferiti");
      }
      return;
    }

    // Logged user: use database
    if (isCurrentlyFavorite) {
      // Remove from favorites
      const { error } = await supabase
        .from("user_favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("place_id", placeId);

      if (error) {
        console.error("Error removing favorite:", error);
        toast.error("Errore nella rimozione");
      } else {
        setFavorites(favorites.filter(id => id !== placeId));
        toast.success("Rimosso dai preferiti");
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from("user_favorites")
        .insert({ user_id: user.id, place_id: placeId });

      if (error) {
        console.error("Error adding favorite:", error);
        toast.error("Errore nell'aggiunta");
      } else {
        setFavorites([...favorites, placeId]);
        toast.success("Aggiunto ai preferiti");
      }
    }
  };

  // Get favorite places for the map
  const favoritePlaces = useMemo(() => {
    return allPlaces.filter(p => favorites.includes(p.id));
  }, [allPlaces, favorites]);

  // Filter places based on search and categories
  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        normalizeCategory(p.category).toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        selectedCategories.includes(normalizeCategory(p.category))
      );
    }

    return filtered;
  }, [allPlaces, searchQuery, selectedCategories]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allPlaces.map(p => normalizeCategory(p.category)).filter(Boolean));
    return Array.from(cats);
  }, [allPlaces]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSendSuggestion = async () => {
    if (!suggestionEmail || !suggestionName || !suggestionPlace) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    // Per ora solo mostriamo un messaggio di successo
    // In futuro si potrà collegare a un edge function con Resend
    toast.success("Suggerimento inviato! Ti contatteremo presto.");
    
    // Reset form
    setSuggestionEmail("");
    setSuggestionName("");
    setSuggestionPlace("");
    setSuggestionMessage("");
    setSuggestionDialogOpen(false);
  };

  const handlePrintMap = async () => {
    if (favoritePlaces.length === 0) {
      toast.error("Aggiungi prima alcuni luoghi alla tua mappa");
      return;
    }

    try {
      toast.loading("Generazione PDF in corso...");
      
      if (!mapContainerRef.current) return;

      // Cattura la mappa
      const canvas = await html2canvas(mapContainerRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 2
      });

      // Crea il PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      
      // Aggiungi lista dei luoghi
      pdf.addPage();
      pdf.setFontSize(20);
      pdf.text("La Mia Guida", 40, 40);
      
      pdf.setFontSize(12);
      let yPosition = 80;
      favoritePlaces.forEach((place, index) => {
        if (yPosition > 550) {
          pdf.addPage();
          yPosition = 40;
        }
        pdf.text(`${index + 1}. ${place.name}`, 40, yPosition);
        pdf.setFontSize(10);
        pdf.text(`   ${normalizeCategory(place.category)} - ${place.city || ""}`, 40, yPosition + 15);
        yPosition += 40;
        pdf.setFontSize(12);
      });

      pdf.save("la-mia-mappa-como.pdf");
      toast.dismiss();
      toast.success("PDF generato con successo!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error("Errore nella generazione del PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Caricamento...</div>
      </div>
      );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Create your own guide</h1>
            <p className="text-xs text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? 'luogo selezionato' : 'luoghi selezionati'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {favoritePlaces.length > 0 && (
              <Button
                onClick={handlePrintMap}
                variant="default"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Stampa
              </Button>
            )}
            {user ? (
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/user-auth")}
                variant="outline"
                size="sm"
              >
                Accedi
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* User's Map */}
      <div ref={mapContainerRef} className="relative h-[50vh] border-b">
        <MapView 
          places={allPlaces}
          className="absolute inset-0 w-full h-full"
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Places List */}
      <div className="px-4 py-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Aggiungi Luoghi</h2>
            
            <Dialog open={suggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sei un local?
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Raccomanda un Luogo</DialogTitle>
                  <DialogDescription>
                    Sei un local e vuoi raccomandare un luogo? Inviaci il tuo suggerimento!
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="suggestion-name">
                      Nome <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="suggestion-name"
                      placeholder="Il tuo nome"
                      value={suggestionName}
                      onChange={(e) => setSuggestionName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suggestion-email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="suggestion-email"
                      type="email"
                      placeholder="tua@email.com"
                      value={suggestionEmail}
                      onChange={(e) => setSuggestionEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suggestion-place">
                      Nome del Luogo <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="suggestion-place"
                      placeholder="Es. Ristorante Da Mario"
                      value={suggestionPlace}
                      onChange={(e) => setSuggestionPlace(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="suggestion-message">
                      Messaggio (opzionale)
                    </Label>
                    <Textarea
                      id="suggestion-message"
                      placeholder="Descrivi il luogo, cosa lo rende speciale, indirizzo..."
                      value={suggestionMessage}
                      onChange={(e) => setSuggestionMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleSendSuggestion} 
                    className="w-full"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Invia Suggerimento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search */}
          <Input
            type="search"
            placeholder="Cerca luoghi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-3"
          />

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategories([])}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategories.length === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Tutti
            </button>
            {categories.slice(0, 10).map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedCategories.includes(cat)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <CategoryBadge category={cat} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid gap-3">
          {filteredPlaces.map(place => {
            const isFavorite = favorites.includes(place.id);
            return (
              <Card key={place.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3 items-center">
                    {/* Category Icon */}
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">
                        <CategoryBadge category={place.category} />
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{place.name}</h3>
                        <Button
                          size="sm"
                          variant={isFavorite ? "default" : "outline"}
                          onClick={() => toggleFavorite(place.id)}
                          className="flex-shrink-0 h-8 w-8 p-0"
                        >
                          {isFavorite ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          {normalizeCategory(place.category)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {place.city && (
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            📍 {place.city}
                          </p>
                        )}
                        
                        <Button
                          size="sm"
                          onClick={() => navigate(`/luogo/${place.slug}`)}
                          className="bg-black hover:bg-black/90 text-white h-7 px-3 text-xs"
                        >
                          Apri luogo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nessun luogo trovato</p>
          </div>
        )}
      </div>
    </div>
  );
}
