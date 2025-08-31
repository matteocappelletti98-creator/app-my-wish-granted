
import { useState } from "react";
import { ArrowLeft, MapPin, Camera, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface AddPlaceForm {
  name: string;
  category: string;
  description: string;
  address: string;
  tags: string;
  rating?: number;
}

const AddPlace = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const form = useForm<AddPlaceForm>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      address: "",
      tags: "",
      rating: undefined
    }
  });

  const categories = [
    "Natura",
    "Ristoranti", 
    "Monumenti",
    "Spiagge",
    "Shopping",
    "Hotel",
    "Musei",
    "Parchi"
  ];

  const suggestedTags = [
    "Vista mare", "Romantico", "Famiglia", "Economico", "Lusso", 
    "Storico", "Moderno", "Tradizionale", "Innovativo", "Rilassante"
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const onSubmit = (data: AddPlaceForm) => {
    console.log("Nuovo luogo:", { ...data, tags: selectedTags });
    // Qui andrà la logica per salvare il luogo
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/places">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Indietro
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Aggiungi Nuovo Luogo</h1>
            <p className="text-muted-foreground">Condividi un posto speciale con la community</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form principale */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dettagli del Luogo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome del Luogo *</FormLabel>
                          <FormControl>
                            <Input placeholder="Es: Ristorante Da Mario" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona una categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Indirizzo</FormLabel>
                          <FormControl>
                            <Input placeholder="Via Roma 123, Milano" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrizione *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descrivi questo luogo e cosa lo rende speciale..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FormLabel>Tags</FormLabel>
                      <div className="mt-2 space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {suggestedTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={selectedTags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <FormField
                          control={form.control}
                          name="tags"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  placeholder="Aggiungi tags personalizzati (separati da virgola)"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-hero">
                      Pubblica Luogo
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Photo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-4 w-4" />
                  Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Aggiungi foto del luogo
                  </p>
                  <Button variant="outline" size="sm">
                    Carica Foto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-4 w-4" />
                  Valutazione
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(Number(value))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Dai un voto" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map((rating) => (
                              <SelectItem key={rating} value={rating.toString()}>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  {rating}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Suggerimenti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Aggiungi foto di qualità per attirare più visitatori</p>
                <p>• Scrivi una descrizione dettagliata e utile</p>
                <p>• Usa tags specifici per aiutare nella ricerca</p>
                <p>• Includi informazioni su orari e prezzi nella descrizione</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlace;
