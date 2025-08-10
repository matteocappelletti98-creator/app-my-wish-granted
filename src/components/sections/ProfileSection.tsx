import { User, MapPin, PenTool, Camera, Settings, Plus, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export const ProfileSection = () => {
  const userStats = {
    placesVisited: 47,
    articlesWritten: 12,
    photosShared: 89,
    followers: 234,
    following: 156,
    totalLikes: 1247
  };

  const recentPlaces = [
    { id: 1, name: "Colosseo", category: "Monumenti", visitedAt: "2024-01-15", image: "🏛️" },
    { id: 2, name: "Trevi Fountain", category: "Monumenti", visitedAt: "2024-01-14", image: "⛲" },
    { id: 3, name: "Villa Borghese", category: "Parchi", visitedAt: "2024-01-12", image: "🌳" }
  ];

  const recentArticles = [
    { id: 1, title: "I segreti di Roma", views: 1234, likes: 89, publishedAt: "2024-01-10" },
    { id: 2, title: "Cucina romana autentica", views: 987, likes: 67, publishedAt: "2024-01-05" }
  ];

  const achievements = [
    { id: 1, name: "Esploratore", description: "Visita 50 luoghi", progress: 94, icon: "🗺️" },
    { id: 2, name: "Narratore", description: "Scrivi 15 articoli", progress: 80, icon: "📝" },
    { id: 3, name: "Fotografo", description: "Condividi 100 foto", progress: 89, icon: "📸" }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="shadow-travel">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-gradient-hero text-white">
                  MR
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-nature-green text-white rounded-full p-1">
                <Award className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Marco Rossi</h1>
                  <p className="text-muted-foreground">Esploratore appassionato</p>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    Roma, Italia
                    <span className="mx-2">•</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    Membro da Gen 2023
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Modifica
                  </Button>
                  <Button size="sm" className="bg-gradient-hero">
                    Condividi Profilo
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.placesVisited}</p>
                  <p className="text-xs text-muted-foreground">Luoghi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.articlesWritten}</p>
                  <p className="text-xs text-muted-foreground">Articoli</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.photosShared}</p>
                  <p className="text-xs text-muted-foreground">Foto</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.followers}</p>
                  <p className="text-xs text-muted-foreground">Follower</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.following}</p>
                  <p className="text-xs text-muted-foreground">Seguiti</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{userStats.totalLikes}</p>
                  <p className="text-xs text-muted-foreground">Like</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="places" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="places">I Miei Luoghi</TabsTrigger>
          <TabsTrigger value="articles">I Miei Articoli</TabsTrigger>
          <TabsTrigger value="photos">Le Mie Foto</TabsTrigger>
          <TabsTrigger value="achievements">Obiettivi</TabsTrigger>
        </TabsList>

        <TabsContent value="places" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Luoghi Visitati di Recente</h2>
            <Button size="sm" className="bg-gradient-nature">
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Luogo
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPlaces.map((place) => (
              <Card key={place.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{place.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{place.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {place.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visitato il {new Date(place.visitedAt).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">I Miei Articoli</h2>
            <Button size="sm" className="bg-gradient-sunset">
              <Plus className="h-4 w-4 mr-2" />
              Scrivi Articolo
            </Button>
          </div>
          <div className="space-y-4">
            {recentArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-soft transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pubblicato il {new Date(article.publishedAt).toLocaleDateString('it-IT')}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>👁️ {article.views} visualizzazioni</span>
                        <span>❤️ {article.likes} like</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="photos" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Le Mie Foto</h2>
            <Button size="sm" className="bg-gradient-hero">
              <Plus className="h-4 w-4 mr-2" />
              Carica Foto
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-sky-light to-ocean-blue rounded-lg flex items-center justify-center text-2xl hover:scale-105 transition-transform cursor-pointer shadow-soft">
                {['📸', '🌅', '🏛️', '🍝', '🌊', '🌳'][i % 6]}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <h2 className="text-xl font-semibold mb-6">I Tuoi Obiettivi</h2>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <span className="text-sm text-muted-foreground">{achievement.progress}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};