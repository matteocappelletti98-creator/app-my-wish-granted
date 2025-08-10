import { Search, Filter, Grid, List, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const PlacesSection = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", name: "Tutti", count: 156, color: "bg-gradient-hero" },
    { id: "nature", name: "Natura", count: 42, color: "bg-nature-green" },
    { id: "restaurants", name: "Ristoranti", count: 38, color: "bg-sunset-orange" },
    { id: "monuments", name: "Monumenti", count: 25, color: "bg-earth-brown" },
    { id: "beaches", name: "Spiagge", count: 18, color: "bg-ocean-blue" },
    { id: "shopping", name: "Shopping", count: 15, color: "bg-accent" },
  ];

  const mockPlaces = [
    {
      id: 1,
      name: "Parco Nazionale delle Cinque Terre",
      category: "Natura",
      rating: 4.9,
      reviews: 1234,
      image: "🌊",
      description: "Uno dei parchi più belli d'Italia con sentieri mozzafiato sul mare",
      tags: ["Escursioni", "Mare", "Trekking"]
    },
    {
      id: 2,
      name: "Osteria del Mare",
      category: "Ristoranti", 
      rating: 4.7,
      reviews: 456,
      image: "🍽️",
      description: "Cucina tradizionale ligure con vista panoramica sul golfo",
      tags: ["Pesce fresco", "Vista mare", "Tradizionale"]
    },
    {
      id: 3,
      name: "Torre di Pisa",
      category: "Monumenti",
      rating: 4.6,
      reviews: 8901,
      image: "🏛️",
      description: "Iconica torre pendente, simbolo mondiale dell'architettura italiana",
      tags: ["Storico", "Architettura", "UNESCO"]
    },
    {
      id: 4,
      name: "Spiaggia di Monterosso",
      category: "Spiagge",
      rating: 4.8,
      reviews: 678,
      image: "🏖️",
      description: "La spiaggia più ampia delle Cinque Terre con sabbia fine",
      tags: ["Sabbia", "Ombrelloni", "Bar"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Luoghi di Interesse</h1>
          <p className="text-muted-foreground mt-2">
            Scopri i luoghi più belli organizzati per categoria
          </p>
        </div>
        <Button size="sm" className="bg-gradient-hero">
          <Plus className="h-4 w-4 mr-2" />
          Aggiungi Luogo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cerca luoghi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPlaces.map((place) => (
                  <Card key={place.id} className="hover:shadow-travel transition-all cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                          {place.image}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{place.rating}</span>
                          <span className="text-muted-foreground">({place.reviews})</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{place.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="secondary" className="mb-3">
                        {place.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {place.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {place.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {mockPlaces.map((place) => (
                  <Card key={place.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{place.image}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold">{place.name}</h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{place.rating}</span>
                              <span className="text-muted-foreground text-sm">({place.reviews})</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="mb-3">
                            {place.category}
                          </Badge>
                          <p className="text-muted-foreground mb-3">
                            {place.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {place.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};