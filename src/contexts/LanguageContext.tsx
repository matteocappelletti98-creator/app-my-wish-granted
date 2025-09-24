import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'it' | 'en' | 'fr' | 'de' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  it: {
    // Navigation
    'nav.home': 'Home',
    'nav.virtualExploration': 'Virtual Exploration',
    'nav.places': 'Luoghi',
    'nav.blog': 'Blog',
    'nav.addPlace': 'Inserisci luogo',
    
    // Home
    'home.title': 'explore',
    'home.subtitle': 'Independent local guide',
    'home.login': 'Accedi',
    'home.register': 'Registrati',
    'home.about': 'Chi siamo?',
    'home.settings': 'Impostazioni',
    'home.selectCity': 'Seleziona città',
    'home.selectLanguage': 'Seleziona lingua',
    'home.allCities': 'Tutte le città',
    'home.virtualExploration': 'Virtual exploration',
    'home.virtualExplorationDesc': 'Esplora luoghi sulla mappa',
    'home.places': 'Luoghi',
    'home.placesDesc': 'Scopri tutti i luoghi',
    'home.blogTitle': 'Blog',
    'home.blogDesc': 'Articoli e guide',
    'home.travellerPath': 'Traveller.Path',
    'home.travellerPathDesc': 'Itinerari personalizzati',
    'home.travellerPathPending': 'Questionario in sospeso',
    'home.finishSurvey': 'Clicca per finire il questionario!',
    'home.whichCity': 'Which city will next?',
    'home.stayTuned': 'Stay tuned my friends',
    'home.workInProgress': 'In corso',
    
    // Blog
    'blog.title': 'blog',
    'blog.subtitle': 'Guide, consigli e storie di viaggio',
    'blog.writeArticle': 'Scrivi articolo',
    'blog.searchArticles': 'Cerca articoli...',
    'blog.filters': 'Filtri',
    'blog.faq': 'FAQ',
    'blog.dayTrip': 'Day Trip',
    'blog.tips': 'Tips',
    'blog.faqTitle': 'Domande frequenti',
    'blog.faqDesc': 'Risposte alle domande più comuni sulla piattaforma',
    'blog.dayTripTitle': 'Itinerari giornalieri',
    'blog.dayTripDesc': 'Scopri i migliori itinerari per gite di un giorno',
    'blog.tipsTitle': 'Consigli di viaggio',
    'blog.tipsDesc': 'Suggerimenti utili per migliorare la tua esperienza di viaggio',
    'blog.read': 'Leggi',
    
    // Virtual Exploration
    'virtual.title': 'virtual exploration',
    'virtual.subtitle': 'Esplora luoghi sulla mappa interattiva',
    'virtual.favorites': 'I tuoi luoghi preferiti',
    'virtual.noFavorites': 'Nessun luogo preferito ancora.',
    'virtual.visit': 'Visita',
    'virtual.googleMap': 'Google Map',
    'virtual.categories': 'Categorie',
    'virtual.all': 'Tutte',
    'virtual.clearFilters': 'Cancella filtri'
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.virtualExploration': 'Virtual Exploration',
    'nav.places': 'Places',
    'nav.blog': 'Blog',
    'nav.addPlace': 'Add Place',
    
    // Home
    'home.title': 'explore',
    'home.subtitle': 'Independent local guide',
    'home.login': 'Login',
    'home.register': 'Register',
    'home.about': 'About Us?',
    'home.settings': 'Settings',
    'home.selectCity': 'Select city',
    'home.selectLanguage': 'Select language',
    'home.allCities': 'All cities',
    'home.virtualExploration': 'Virtual exploration',
    'home.virtualExplorationDesc': 'Explore places on the map',
    'home.places': 'Places',
    'home.placesDesc': 'Discover all places',
    'home.blogTitle': 'Blog',
    'home.blogDesc': 'Articles and guides',
    'home.travellerPath': 'Traveller.Path',
    'home.travellerPathDesc': 'Personalized itineraries',
    'home.travellerPathPending': 'Pending questionnaire',
    'home.finishSurvey': 'Click to finish the questionnaire!',
    'home.whichCity': 'Which city will next?',
    'home.stayTuned': 'Stay tuned my friends',
    'home.workInProgress': 'In progress',
    
    // Blog
    'blog.title': 'blog',
    'blog.subtitle': 'Guides, tips and travel stories',
    'blog.writeArticle': 'Write article',
    'blog.searchArticles': 'Search articles...',
    'blog.filters': 'Filters',
    'blog.faq': 'FAQ',
    'blog.dayTrip': 'Day Trip',
    'blog.tips': 'Tips',
    'blog.faqTitle': 'Frequently Asked Questions',
    'blog.faqDesc': 'Answers to the most common questions about the platform',
    'blog.dayTripTitle': 'Daily itineraries',
    'blog.dayTripDesc': 'Discover the best itineraries for day trips',
    'blog.tipsTitle': 'Travel tips',
    'blog.tipsDesc': 'Useful suggestions to improve your travel experience',
    'blog.read': 'Read',
    
    // Virtual Exploration
    'virtual.title': 'virtual exploration',
    'virtual.subtitle': 'Explore places on the interactive map',
    'virtual.favorites': 'Your favorite places',
    'virtual.noFavorites': 'No favorite places yet.',
    'virtual.visit': 'Visit',
    'virtual.googleMap': 'Google Map',
    'virtual.categories': 'Categories',
    'virtual.all': 'All',
    'virtual.clearFilters': 'Clear filters'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.virtualExploration': 'Exploration Virtuelle',
    'nav.places': 'Lieux',
    'nav.blog': 'Blog',
    'nav.addPlace': 'Ajouter lieu',
    
    // Home
    'home.title': 'explorer',
    'home.subtitle': 'Guide local indépendant',
    'home.login': 'Connexion',
    'home.register': 'S\'inscrire',
    'home.about': 'Qui sommes-nous?',
    'home.settings': 'Paramètres',
    'home.selectCity': 'Sélectionner ville',
    'home.selectLanguage': 'Sélectionner langue',
    'home.allCities': 'Toutes les villes',
    'home.virtualExploration': 'Exploration virtuelle',
    'home.virtualExplorationDesc': 'Explorez les lieux sur la carte',
    'home.places': 'Lieux',
    'home.placesDesc': 'Découvrez tous les lieux',
    'home.blogTitle': 'Blog',
    'home.blogDesc': 'Articles et guides',
    'home.travellerPath': 'Traveller.Path',
    'home.travellerPathDesc': 'Itinéraires personnalisés',
    'home.travellerPathPending': 'Questionnaire en attente',
    'home.finishSurvey': 'Cliquez pour terminer le questionnaire!',
    'home.whichCity': 'Quelle ville sera la prochaine?',
    'home.stayTuned': 'Restez à l\'écoute mes amis',
    'home.workInProgress': 'En cours',
    
    // Blog
    'blog.title': 'blog',
    'blog.subtitle': 'Guides, conseils et histoires de voyage',
    'blog.writeArticle': 'Écrire article',
    'blog.searchArticles': 'Rechercher articles...',
    'blog.filters': 'Filtres',
    'blog.faq': 'FAQ',
    'blog.dayTrip': 'Excursion',
    'blog.tips': 'Conseils',
    'blog.faqTitle': 'Questions fréquentes',
    'blog.faqDesc': 'Réponses aux questions les plus courantes sur la plateforme',
    'blog.dayTripTitle': 'Itinéraires journaliers',
    'blog.dayTripDesc': 'Découvrez les meilleurs itinéraires pour des excursions d\'une journée',
    'blog.tipsTitle': 'Conseils de voyage',
    'blog.tipsDesc': 'Suggestions utiles pour améliorer votre expérience de voyage',
    'blog.read': 'Lire',
    
    // Virtual Exploration
    'virtual.title': 'exploration virtuelle',
    'virtual.subtitle': 'Explorez les lieux sur la carte interactive',
    'virtual.favorites': 'Vos lieux favoris',
    'virtual.noFavorites': 'Aucun lieu favori pour le moment.',
    'virtual.visit': 'Visiter',
    'virtual.googleMap': 'Google Map',
    'virtual.categories': 'Catégories',
    'virtual.all': 'Toutes',
    'virtual.clearFilters': 'Effacer filtres'
  },
  de: {
    // Navigation
    'nav.home': 'Startseite',
    'nav.virtualExploration': 'Virtuelle Erkundung',
    'nav.places': 'Orte',
    'nav.blog': 'Blog',
    'nav.addPlace': 'Ort hinzufügen',
    
    // Home
    'home.title': 'erkunden',
    'home.subtitle': 'Unabhängiger lokaler Führer',
    'home.login': 'Anmelden',
    'home.register': 'Registrieren',
    'home.about': 'Wer sind wir?',
    'home.settings': 'Einstellungen',
    'home.selectCity': 'Stadt wählen',
    'home.selectLanguage': 'Sprache wählen',
    'home.allCities': 'Alle Städte',
    'home.virtualExploration': 'Virtuelle Erkundung',
    'home.virtualExplorationDesc': 'Orte auf der Karte erkunden',
    'home.places': 'Orte',
    'home.placesDesc': 'Alle Orte entdecken',
    'home.blogTitle': 'Blog',
    'home.blogDesc': 'Artikel und Leitfäden',
    'home.travellerPath': 'Traveller.Path',
    'home.travellerPathDesc': 'Personalisierte Routen',
    'home.travellerPathPending': 'Ausstehender Fragebogen',
    'home.finishSurvey': 'Klicken Sie, um den Fragebogen zu beenden!',
    'home.whichCity': 'Welche Stadt wird als nächstes kommen?',
    'home.stayTuned': 'Bleibt dran, meine Freunde',
    'home.workInProgress': 'In Bearbeitung',
    
    // Blog
    'blog.title': 'blog',
    'blog.subtitle': 'Leitfäden, Tipps und Reisegeschichten',
    'blog.writeArticle': 'Artikel schreiben',
    'blog.searchArticles': 'Artikel suchen...',
    'blog.filters': 'Filter',
    'blog.faq': 'FAQ',
    'blog.dayTrip': 'Tagesausflug',
    'blog.tips': 'Tipps',
    'blog.faqTitle': 'Häufig gestellte Fragen',
    'blog.faqDesc': 'Antworten auf die häufigsten Fragen zur Plattform',
    'blog.dayTripTitle': 'Tagesrouten',
    'blog.dayTripDesc': 'Entdecken Sie die besten Routen für Tagesausflüge',
    'blog.tipsTitle': 'Reisetipps',
    'blog.tipsDesc': 'Nützliche Vorschläge zur Verbesserung Ihrer Reiseerfahrung',
    'blog.read': 'Lesen',
    
    // Virtual Exploration
    'virtual.title': 'virtuelle erkundung',
    'virtual.subtitle': 'Orte auf der interaktiven Karte erkunden',
    'virtual.favorites': 'Ihre Lieblingsorte',
    'virtual.noFavorites': 'Noch keine Lieblingsorte.',
    'virtual.visit': 'Besuchen',
    'virtual.googleMap': 'Google Map',
    'virtual.categories': 'Kategorien',
    'virtual.all': 'Alle',
    'virtual.clearFilters': 'Filter löschen'
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.virtualExploration': 'Exploración Virtual',
    'nav.places': 'Lugares',
    'nav.blog': 'Blog',
    'nav.addPlace': 'Añadir lugar',
    
    // Home
    'home.title': 'explorar',
    'home.subtitle': 'Guía local independiente',
    'home.login': 'Iniciar sesión',
    'home.register': 'Registrarse',
    'home.about': '¿Quiénes somos?',
    'home.settings': 'Configuración',
    'home.selectCity': 'Seleccionar ciudad',
    'home.selectLanguage': 'Seleccionar idioma',
    'home.allCities': 'Todas las ciudades',
    'home.virtualExploration': 'Exploración virtual',
    'home.virtualExplorationDesc': 'Explora lugares en el mapa',
    'home.places': 'Lugares',
    'home.placesDesc': 'Descubre todos los lugares',
    'home.blogTitle': 'Blog',
    'home.blogDesc': 'Artículos y guías',
    'home.travellerPath': 'Traveller.Path',
    'home.travellerPathDesc': 'Itinerarios personalizados',
    'home.travellerPathPending': 'Cuestionario pendiente',
    'home.finishSurvey': '¡Haz clic para terminar el cuestionario!',
    'home.whichCity': '¿Cuál será la próxima ciudad?',
    'home.stayTuned': 'Manténganse atentos, amigos',
    'home.workInProgress': 'En progreso',
    
    // Blog
    'blog.title': 'blog',
    'blog.subtitle': 'Guías, consejos e historias de viaje',
    'blog.writeArticle': 'Escribir artículo',
    'blog.searchArticles': 'Buscar artículos...',
    'blog.filters': 'Filtros',
    'blog.faq': 'FAQ',
    'blog.dayTrip': 'Excursión',
    'blog.tips': 'Consejos',
    'blog.faqTitle': 'Preguntas frecuentes',
    'blog.faqDesc': 'Respuestas a las preguntas más comunes sobre la plataforma',
    'blog.dayTripTitle': 'Itinerarios diarios',
    'blog.dayTripDesc': 'Descubre los mejores itinerarios para excursiones de un día',
    'blog.tipsTitle': 'Consejos de viaje',
    'blog.tipsDesc': 'Sugerencias útiles para mejorar tu experiencia de viaje',
    'blog.read': 'Leer',
    
    // Virtual Exploration
    'virtual.title': 'exploración virtual',
    'virtual.subtitle': 'Explora lugares en el mapa interactivo',
    'virtual.favorites': 'Tus lugares favoritos',
    'virtual.noFavorites': 'Aún no hay lugares favoritos.',
    'virtual.visit': 'Visitar',
    'virtual.googleMap': 'Google Map',
    'virtual.categories': 'Categorías',
    'virtual.all': 'Todas',
    'virtual.clearFilters': 'Limpiar filtros'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('it');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}