import React, { useState, useMemo } from "react";
import { Search, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const CategoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "nature", name: "Natura", count: 42, color: "bg-nature-green", emoji: "🌿" },
    { id: "restaurants", name: "Ristoranti", count: 38, color: "bg-sunset-orange", emoji: "🍽️" },
    { id: "monuments", name: "Monumenti", count: 25, color: "bg-earth-brown", emoji: "🏛️" },
    { id: "beaches", name: "Spiagge", count: 18, color: "bg-ocean-blue", emoji: "🏖️" },
    { id: "shopping", name: "Shopping", count: 15, color: "bg-accent", emoji: "🛍️" },
    { id: "culture", name: "Cultura", count: 22, color: "bg-primary", emoji: "🎨" },
  ];

  const mockPlaces = [
    {
      id: 1,
      name: "Parco Nazionale delle Cinque Terre",
      category: "nature",
      rating: 4.9,
      reviews: 1234,
      image: "🌊",
      description: "Uno dei parchi più belli d'Italia con sentieri mozzafiato sul mare",
      tags: ["Escursioni", "Mare", "Trekking"]
    },
    {
      id: 2,
      name: "Osteria del Mare",
      category: "restaurants", 
      rating: 4.7,
      reviews: 456,
      image: "🍽️",
      description: "Cucina tradizionale ligure con vista panoramica sul golfo",
      tags: ["Pesce fresco", "Vista mare", "Tradizionale"]
    },
    {
      id: 3,
      name: "Torre di Pisa",
      category: "monuments",
      rating: 4.6,
      reviews: 8901,
      image: "🏛️",
      description: "Iconica torre pendente, simbolo mondiale dell'architettura italiana",
      tags: ["Storico", "Architettura", "UNESCO"]
    },
    {
      id: 4,
      name: "Spiaggia di Monterosso",
      category: "beaches",
      rating: 4.8,
      reviews: 678,
      image: "🏖️",
      description: "La spiaggia più ampia delle Cinque Terre con sabbia fine",
      tags: ["Sabbia", "Ombrelloni", "Bar"]
    },
    {
      id: 5,
      name: "Galleria Borghese",
      category: "culture",
      rating: 4.9,
      reviews: 892,
      image: "🎨",
      description: "Splendida collezione d'arte rinascimentale e barocca",
      tags: ["Arte", "Museo", "Bernini"]
    },
    {
      id: 6,
      name: "Via del Corso",
      category: "shopping",
      rating: 4.4,
      reviews: 234,
      image: "🛍️",
      description: "La via dello shopping per eccellenza nel centro di Roma",
      tags: ["Moda", "Centro", "Boutique"]
    }
  ];

  const filteredPlaces = useMemo(() => {
    const places = selectedCategory 
      ? mockPlaces.filter(p => p.category === selectedCategory)
      : mockPlaces;
    
    if (!searchQuery) return places;
    
    const needle = searchQuery.toLowerCase();
    return places.filter(p => 
      p.name.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle) ||
      p.tags.some(tag => tag.toLowerCase().includes(needle))
    );
  }, [selectedCategory, searchQuery]);

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className="space-y-6">
        {/* Back button and category header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedCategory(null)}>
            ← Torna alle categorie
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{category?.emoji}</div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{category?.name}</h1>
              <p className="text-muted-foreground">
                {filteredPlaces.length} luoghi disponibili
              </p>
            </div>
          </div>
        </div>

        {/* Search and view controls */}
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

        {/* Places grid/list */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
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
            {filteredPlaces.map((place) => (
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Categorie</h1>
        <p className="text-muted-foreground mt-2">
          Esplora i luoghi organizzati per categoria
        </p>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id} 
            className="hover:shadow-travel transition-all cursor-pointer group"
            onClick={() => setSelectedCategory(category.id)}
          >
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="text-6xl group-hover:scale-110 transition-transform">
                  {category.emoji}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{category.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {category.count} luoghi disponibili
                  </p>
                </div>
                <div className={`w-full h-1 rounded-full ${category.color}`}></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};