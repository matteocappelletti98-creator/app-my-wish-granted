import { 
  MapPin, 
  List, 
  PenTool, 
  User, 
  Mountain, 
  Utensils, 
  Camera, 
  ShoppingBag,
  Building,
  Waves,
  TreePine,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: "map", label: "Mappa", icon: MapPin },
  { id: "places", label: "Luoghi", icon: List },
  { id: "blog", label: "Blog", icon: PenTool },
  { id: "profile", label: "Il Mio Profilo", icon: User },
];

const categoryItems = [
  { id: "nature", label: "Natura", icon: TreePine, color: "text-nature-green" },
  { id: "restaurants", label: "Ristoranti", icon: Utensils, color: "text-sunset-orange" },
  { id: "monuments", label: "Monumenti", icon: Building, color: "text-earth-brown" },
  { id: "mountains", label: "Montagne", icon: Mountain, color: "text-nature-green" },
  { id: "beaches", label: "Spiagge", icon: Waves, color: "text-ocean-blue" },
  { id: "photo-spots", label: "Foto Spot", icon: Camera, color: "text-accent" },
  { id: "shopping", label: "Shopping", icon: ShoppingBag, color: "text-sunset-orange" },
];

export const Sidebar = ({ isOpen, onClose, activeSection, onSectionChange }: SidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-background border-r border-border transition-transform z-50",
        "md:translate-x-0 md:static md:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 space-y-6 h-full overflow-y-auto">
          {/* Close button for mobile */}
          <div className="md:hidden flex justify-end">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Navigation */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Navigazione
            </h2>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-11 px-3",
                      activeSection === item.id && "bg-primary/10 text-primary border-primary/20"
                    )}
                    onClick={() => {
                      onSectionChange(item.id);
                      onClose();
                    }}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Categorie
            </h2>
            <nav className="space-y-1">
              {categoryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start h-10 px-3 hover:bg-muted/50"
                    onClick={() => {
                      onSectionChange(`category-${item.id}`);
                      onClose();
                    }}
                  >
                    <Icon className={cn("h-4 w-4 mr-3", item.color)} />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-hero rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-2">I tuoi viaggi</h3>
            <div className="space-y-1 text-sm opacity-90">
              <p>• 12 luoghi visitati</p>
              <p>• 5 articoli pubblicati</p>
              <p>• 8 foto condivise</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white border-0"
            >
              Vedi statistiche
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};