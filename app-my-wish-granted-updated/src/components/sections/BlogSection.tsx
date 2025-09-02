import { PenTool, Calendar, Eye, Heart, MessageCircle, Plus, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export const BlogSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockArticles = [
    {
      id: 1,
      title: "Le gemme nascoste delle Cinque Terre",
      excerpt: "Scopri i sentieri meno battuti e i panorami più spettacolari di questo paradiso ligure...",
      content: "Una guida completa per esplorare le Cinque Terre oltre i percorsi turistici tradizionali.",
      author: {
        name: "Marco Rossi",
        avatar: "MR",
        role: "Travel Blogger"
      },
      publishedAt: "2024-01-15",
      readTime: "8 min",
      views: 1234,
      likes: 89,
      comments: 23,
      category: "Escursioni",
      image: "🌅",
      tags: ["Cinque Terre", "Escursioni", "Liguria", "Panorami"]
    },
    {
      id: 2,
      title: "Cucina tradizionale toscana: dove mangiare a Firenze",
      excerpt: "I migliori ristoranti familiari e trattorie nascoste nel centro storico di Firenze...",
      content: "Un viaggio culinario attraverso i sapori autentici della Toscana.",
      author: {
        name: "Giulia Bianchi",
        avatar: "GB",
        role: "Food Expert"
      },
      publishedAt: "2024-01-12",
      readTime: "6 min",
      views: 2156,
      likes: 156,
      comments: 34,
      category: "Gastronomia",
      image: "🍝",
      tags: ["Firenze", "Toscana", "Ristoranti", "Tradizione"]
    },
    {
      id: 3,
      title: "Roma al tramonto: i migliori punti panoramici",
      excerpt: "Dove ammirare la Città Eterna nella sua veste più romantica e suggestiva...",
      content: "Una selezione dei luoghi più belli per godersi il tramonto a Roma.",
      author: {
        name: "Alessandro Verde",
        avatar: "AV",
        role: "Photographer"
      },
      publishedAt: "2024-01-10",
      readTime: "5 min",
      views: 987,
      likes: 78,
      comments: 12,
      category: "Fotografia",
      image: "📸",
      tags: ["Roma", "Tramonto", "Fotografia", "Panorami"]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog di Viaggio</h1>
          <p className="text-muted-foreground mt-2">
            Storie, consigli e esperienze dai viaggiatori della community
          </p>
        </div>
        <Button size="sm" className="bg-gradient-hero">
          <Plus className="h-4 w-4 mr-2" />
          Scrivi Articolo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cerca articoli..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtri
        </Button>
      </div>

      {/* Featured Article */}
      <Card className="overflow-hidden shadow-travel">
        <div className="bg-gradient-sunset p-6 text-white">
          <Badge variant="secondary" className="bg-white/20 text-white mb-4">
            Articolo in evidenza
          </Badge>
          <h2 className="text-2xl font-bold mb-2">{mockArticles[0].title}</h2>
          <p className="text-white/90 mb-4">{mockArticles[0].excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-white/20 text-white">
                  {mockArticles[0].author.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{mockArticles[0].author.name}</p>
                <p className="text-sm text-white/70">{mockArticles[0].author.role}</p>
              </div>
            </div>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              Leggi di più
            </Button>
          </div>
        </div>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockArticles.slice(1).map((article) => (
          <Card key={article.id} className="hover:shadow-soft transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl group-hover:scale-110 transition-transform">
                  {article.image}
                </div>
                <Badge variant="secondary">
                  {article.category}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {article.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{article.author.name}</p>
                  <div className="flex items-center text-muted-foreground space-x-3">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString('it-IT')}
                    </span>
                    <span>{article.readTime} lettura</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.views}
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {article.likes}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {article.comments}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Carica altri articoli
        </Button>
      </div>
    </div>
  );
};