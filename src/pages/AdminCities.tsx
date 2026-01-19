import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Power, Trash2, MapPin, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  lat: number;
  lng: number;
  zoom_level: number;
  poi_count: number;
  created_at: string;
  updated_at: string;
}

const ADMIN_PASSWORD = "2324";

export default function AdminCities() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCity, setNewCity] = useState({ name: "", lat: "", lng: "", zoom_level: "12" });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Carica le città
  const loadCities = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCities((data as City[]) || []);
    } catch (error: any) {
      console.error('Errore caricamento città:', error);
      toast.error('Errore nel caricamento delle città');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, [isAuthenticated]);

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Accesso effettuato");
    } else {
      toast.error("Password non valida");
    }
  };

  // Toggle attivo/disattivo città
  const toggleCity = async (city: City) => {
    try {
      const response = await supabase.functions.invoke('admin-cities', {
        body: {
          password: ADMIN_PASSWORD,
          id: city.id,
          is_active: !city.is_active
        }
      });

      // Handle the response - check both error and data.error
      if (response.error) {
        throw new Error(response.error.message || 'Errore nella chiamata');
      }
      
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      setCities(cities.map(c => 
        c.id === city.id ? { ...c, is_active: !city.is_active } : c
      ));
      
      toast.success(`${city.name} ${!city.is_active ? 'attivata' : 'disattivata'}`);
    } catch (error: any) {
      console.error('Errore toggle città:', error);
      toast.error(error.message || 'Errore nel toggle della città');
    }
  };

  // Crea nuova città
  const createCity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCity.name || !newCity.lat || !newCity.lng) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    try {
      const response = await supabase.functions.invoke('admin-cities', {
        body: {
          password: ADMIN_PASSWORD,
          name: newCity.name,
          lat: parseFloat(newCity.lat),
          lng: parseFloat(newCity.lng),
          zoom_level: parseInt(newCity.zoom_level)
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Errore nella chiamata');
      }
      
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success(`Città "${newCity.name}" creata`);
      setNewCity({ name: "", lat: "", lng: "", zoom_level: "12" });
      setDialogOpen(false);
      loadCities();
    } catch (error: any) {
      console.error('Errore creazione città:', error);
      toast.error(error.message || 'Errore nella creazione della città');
    }
  };

  // Elimina città
  const deleteCity = async (city: City) => {
    if (!confirm(`Eliminare la città "${city.name}"?`)) return;

    try {
      const response = await supabase.functions.invoke('admin-cities', {
        body: {
          password: ADMIN_PASSWORD,
          id: city.id
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Errore nella chiamata');
      }
      
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      setCities(cities.filter(c => c.id !== city.id));
      toast.success(`Città "${city.name}" eliminata`);
    } catch (error: any) {
      console.error('Errore eliminazione città:', error);
      toast.error(error.message || 'Errore nell\'eliminazione della città');
    }
  };

  // Schermata login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 border border-white/50 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-center text-blue-900 mb-6">
              Admin Città
            </h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full">
                Accedi
              </Button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <Link to="/impostazioni" className="text-sm text-blue-600 hover:underline">
              ← Torna alle impostazioni
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/impostazioni" 
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Impostazioni</span>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extralight text-blue-900 mb-2 tracking-wide">
                  Gestione Città
                </h1>
                <p className="text-blue-700/70 font-light text-sm">
                  Attiva/disattiva le città sulla mappa
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadCities} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuova Città
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Aggiungi Nuova Città</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={createCity} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="name">Nome città *</Label>
                        <Input
                          id="name"
                          value={newCity.name}
                          onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                          placeholder="es. Milano"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="lat">Latitudine *</Label>
                          <Input
                            id="lat"
                            type="number"
                            step="any"
                            value={newCity.lat}
                            onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })}
                            placeholder="45.4642"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lng">Longitudine *</Label>
                          <Input
                            id="lng"
                            type="number"
                            step="any"
                            value={newCity.lng}
                            onChange={(e) => setNewCity({ ...newCity, lng: e.target.value })}
                            placeholder="9.1900"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="zoom">Livello zoom</Label>
                        <Input
                          id="zoom"
                          type="number"
                          value={newCity.zoom_level}
                          onChange={(e) => setNewCity({ ...newCity, zoom_level: e.target.value })}
                          placeholder="12"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Crea Città
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Cities List */}
          <div className="space-y-3">
            {loading && cities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Caricamento...
              </div>
            ) : cities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nessuna città configurata
              </div>
            ) : (
              cities.map((city) => (
                <div
                  key={city.id}
                  className={`bg-white/70 backdrop-blur-lg rounded-2xl p-6 border shadow-lg transition-all ${
                    city.is_active 
                      ? 'border-green-500/50 bg-green-50/30' 
                      : 'border-white/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        city.is_active 
                          ? 'bg-gradient-to-br from-green-100 to-emerald-100' 
                          : 'bg-gradient-to-br from-gray-100 to-slate-100'
                      }`}>
                        <MapPin className={`w-6 h-6 ${city.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-blue-900 flex items-center gap-2">
                          {city.name}
                          {city.is_active && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              ONLINE
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-blue-600/70">
                          {city.lat.toFixed(4)}, {city.lng.toFixed(4)} • Zoom: {city.zoom_level}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {city.poi_count} POI associati
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {city.is_active ? 'Attiva' : 'Disattiva'}
                        </span>
                        <Switch
                          checked={city.is_active}
                          onCheckedChange={() => toggleCity(city)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCity(city)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info */}
          <div className="mt-8 bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
            <h4 className="font-medium text-blue-900 mb-2">ℹ️ Come funziona</h4>
            <ul className="text-sm text-blue-700/80 space-y-1">
              <li>• <strong>Città attiva:</strong> I POI della città sono visibili singolarmente sulla mappa</li>
              <li>• <strong>Città disattivata:</strong> Compare un "Big POI" cliccabile che rappresenta l'intera città</li>
              <li>• Le città si aggiornano automaticamente in base ai suggerimenti degli utenti</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
