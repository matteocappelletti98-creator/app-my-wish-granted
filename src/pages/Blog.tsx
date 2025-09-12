import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, User, Eye, Heart, MessageCircle } from "lucide-react";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data per gli articoli
  const articles = {
    faq: [
      {
        id: 1,
        title: "Come funziona la mappa interattiva?",
        excerpt: "Scopri come navigare e utilizzare al meglio la nostra mappa per esplorare i luoghi più interessanti.",
        author: "Marco Rossi",
        date: "15 Gen 2024",
        views: 245,
        likes: 12,
        comments: 5,
        image: "/public/duomodicomo.png"
      },
      {
        id: 2,
        title: "Come aggiungere un nuovo luogo?",
        excerpt: "Guida passo-passo per contribuire alla community aggiungendo i tuoi luoghi preferiti.",
        author: "Laura Bianchi",
        date: "12 Gen 2024",
        views: 189,
        likes: 8,
        comments: 3,
        image: "/public/beretta.png"
      }
    ],
    daytrip: [
      {
        id: 3,
        title: "Un giorno a Como: itinerario perfetto",
        excerpt: "Dalle rive del lago alle ville storiche, ecco come vivere al meglio una giornata nella città di Como.",
        author: "Giulia Verdi",
        date: "18 Gen 2024",
        views: 532,
        likes: 45,
        comments: 12,
        image: "/public/duomodicomo.png"
      },
      {
        id: 4,
        title: "Bergamo Alta in 6 ore",
        excerpt: "Scopri i tesori della città alta di Bergamo in un itinerario ottimizzato per una giornata indimenticabile.",
        author: "Andrea Neri",
        date: "14 Gen 2024",
        views: 398,
        likes: 32,
        comments: 8,
        image: "/public/beretta.png"
      }
    ],
    tips: [
      {
        id: 5,
        title: "5 consigli per fotografare i luoghi storici",
        excerpt: "Tecniche e suggerimenti per catturare la bellezza dei monumenti e dei luoghi storici che visiti.",
        author: "Elena Russo",
        date: "20 Gen 2024",
        views: 287,
        likes: 23,
        comments: 6,
        image: "/public/caffe-ecaffe-immagine.jpg"
      },
      {
        id: 6,
        title: "Viaggiare sostenibile: guida pratica",
        excerpt: "Come esplorare nuovi luoghi rispettando l'ambiente e le comunità locali.",
        author: "Roberto Costa",
        date: "16 Gen 2024",
        views: 412,
        likes: 38,
        comments: 15,
        image: "/public/duomodicomo.png"
      }
    ]
  };

  const renderArticles = (categoryArticles: any[]) => (
    <div className="grid gap-6 md:grid-cols-2">
      {categoryArticles.map(article => (
        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-lg leading-tight hover:text-blue-600 cursor-pointer">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <User className="w-3 h-3" />
              <span>{article.author}</span>
              <Calendar className="w-3 h-3 ml-2" />
              <span>{article.date}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{article.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>{article.comments}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Leggi</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
                <p className="text-gray-600 mt-2">Guide, consigli e storie di viaggio</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Scrivi articolo
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filtri</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="faq" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="daytrip">Day Trip</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Domande frequenti</h2>
                <p className="text-gray-600 mb-6">Risposte alle domande più comuni sulla piattaforma</p>
                {renderArticles(articles.faq)}
              </div>
            </TabsContent>

            <TabsContent value="daytrip" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Itinerari giornalieri</h2>
                <p className="text-gray-600 mb-6">Scopri i migliori itinerari per gite di un giorno</p>
                {renderArticles(articles.daytrip)}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Consigli di viaggio</h2>
                <p className="text-gray-600 mb-6">Suggerimenti utili per migliorare la tua esperienza di viaggio</p>
                {renderArticles(articles.tips)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}