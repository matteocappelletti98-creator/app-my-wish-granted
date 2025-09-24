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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categoryArticles.map(article => (
        <Card key={article.id} className="group overflow-hidden bg-white/60 backdrop-blur-lg border border-blue-100/50 hover:bg-white/80 hover:shadow-2xl hover:shadow-blue-100/20 transition-all duration-500 hover:-translate-y-2 rounded-3xl">
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-light leading-tight text-blue-900 hover:text-blue-600 cursor-pointer transition-colors duration-300 tracking-wide">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            <p className="text-blue-700/70 text-sm leading-relaxed font-light line-clamp-2">{article.excerpt}</p>
            
            <div className="flex items-center gap-3 text-xs text-blue-600/60">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span className="font-light">{article.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="font-light">{article.date}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-blue-100/30">
              <div className="flex items-center gap-3 text-xs text-blue-600/60">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span className="font-light">{article.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span className="font-light">{article.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span className="font-light">{article.comments}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-white/80 border-blue-100/50 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 rounded-xl font-light">
                Leggi
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-sm border-b border-blue-100/50">
        <div className="px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-6xl md:text-7xl font-extralight text-blue-900 mb-4 tracking-wider">
                blog
              </h1>
              <p className="text-xl text-blue-700/70 font-light tracking-wide mb-8">Guide, consigli e storie di viaggio</p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto mb-8"></div>
              
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium tracking-wide hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 px-8 py-4">
                Scrivi articolo
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600/40 w-5 h-5" />
                <Input
                  placeholder="Cerca articoli..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 bg-white/80 backdrop-blur-sm border-blue-100/50 rounded-2xl text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all font-light"
                />
              </div>
              <Button variant="outline" className="px-6 py-4 bg-white/80 backdrop-blur-sm border-blue-100/50 rounded-2xl text-blue-600 hover:bg-white/90 transition-all">
                Filtri
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-xs mx-auto bg-white/80 backdrop-blur-sm border border-blue-100/50 rounded-2xl p-1">
              <TabsTrigger value="faq" className="rounded-xl py-2 px-4 font-light tracking-wide data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-sm">FAQ</TabsTrigger>
              <TabsTrigger value="daytrip" className="rounded-xl py-2 px-4 font-light tracking-wide data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-sm">Day Trip</TabsTrigger>
              <TabsTrigger value="tips" className="rounded-xl py-2 px-4 font-light tracking-wide data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all text-sm">Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extralight text-blue-900 mb-4 tracking-wide">Domande frequenti</h2>
                <p className="text-blue-700/70 font-light tracking-wide text-lg">Risposte alle domande più comuni sulla piattaforma</p>
                <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
              </div>
              {renderArticles(articles.faq)}
            </TabsContent>

            <TabsContent value="daytrip" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extralight text-blue-900 mb-4 tracking-wide">Itinerari giornalieri</h2>
                <p className="text-blue-700/70 font-light tracking-wide text-lg">Scopri i migliori itinerari per gite di un giorno</p>
                <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
              </div>
              {renderArticles(articles.daytrip)}
            </TabsContent>

            <TabsContent value="tips" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extralight text-blue-900 mb-4 tracking-wide">Consigli di viaggio</h2>
                <p className="text-blue-700/70 font-light tracking-wide text-lg">Suggerimenti utili per migliorare la tua esperienza di viaggio</p>
                <div className="mt-6 w-16 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mx-auto"></div>
              </div>
              {renderArticles(articles.tips)}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}