import { MapPin, Plus, Filter, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MapSection = () => {
  // Dati mock per i luoghi
  const mockPlaces = [
    {
      id: 1,
      name: "Colosseo",
      category: "Monumenti",
      rating: 4.8,
      image: "🏛️",
      coordinates: { lat: 41.8902, lng: 12.4922 }
    },
    {
      id: 2,
      name: "Trevi Fountain",
      category: "Monumenti",
      rating: 4.6,
      image: "⛲",
      coordinates: { lat: 41.9009, lng: 12.4833 }
    },
    {
      id: 3,
      name: "Osteria del Borgo",
      category: "Ristoranti",
      rating: 4.9,
      image: "🍝",
      coordinates: { lat: 41.8955, lng: 12.4823 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mappa Interattiva</h1>
          <p className="text-muted-foreground mt-2">
            Esplora e scopri luoghi incredibili intorno a te
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtri
          </Button>
          <Button variant="outline" size="sm">
            <Layers className="h-4 w-4 mr-2" />
            Livelli
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] relative overflow-hidden shadow-travel">
            <CardContent className="p-0 h-full">
              {/* Placeholder map */}
              <div className="w-full h-full bg-gradient-to-br from-sky-light to-ocean-blue relative flex items-center justify-center">
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full bg-repeat opacity-30" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}></div>
                </div>
                
                <div className="text-center text-white z-10">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">Mappa Interattiva</h3>
                  <p className="text-sm opacity-90 max-w-md">
                    La mappa sarà completamente funzionale una volta collegato Supabase.
                    <br />
                    Qui potrai vedere tutti i luoghi di interesse in tempo reale.
                  </p>
                </div>

                {/* Mock location pins */}
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-sunset-orange rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                    📍
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-nature-green rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                    📍
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-earth-brown rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                    📍
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Places List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Luoghi Nelle Vicinanze</h2>
          <div className="space-y-3">
            {mockPlaces.map((place) => (
              <Card key={place.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{place.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{place.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {place.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ⭐ {place.rating}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Lat: {place.coordinates.lat}, Lng: {place.coordinates.lng}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button variant="outline" className="w-full">
            Vedi tutti i luoghi
          </Button>
        </div>
      </div>
    </div>
  );
};