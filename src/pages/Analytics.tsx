import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Globe, MapPin, Users, Calendar, ArrowLeft, Lock, MousePointer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventsAnalytics } from "@/components/analytics/EventsAnalytics";

interface VisitStats {
  total_visits: number;
  unique_countries: string[];
  visits_by_country: Record<string, number>;
  visits_by_city: Record<string, number>;
  visits_today: number;
  visits_this_week: number;
}

const ANALYTICS_PASSWORD = "2324";

export default function Analytics() {
  const [stats, setStats] = useState<VisitStats | null>(null);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ANALYTICS_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      sessionStorage.setItem('analytics_auth', 'true');
    } else {
      setPasswordError(true);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('analytics_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const loadAnalytics = async () => {
    try {
      const { data: visits, error } = await supabase
        .from('app_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (visits) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const visitsByCountry: Record<string, number> = {};
        const visitsByCity: Record<string, number> = {};
        let visitsToday = 0;
        let visitsThisWeek = 0;

        visits.forEach(visit => {
          const visitDate = new Date(visit.created_at);
          
          if (visitDate >= today) visitsToday++;
          if (visitDate >= weekAgo) visitsThisWeek++;
          
          if (visit.country) {
            visitsByCountry[visit.country] = (visitsByCountry[visit.country] || 0) + 1;
          }
          if (visit.city) {
            visitsByCity[visit.city] = (visitsByCity[visit.city] || 0) + 1;
          }
        });

        setStats({
          total_visits: visits.length,
          unique_countries: Object.keys(visitsByCountry),
          visits_by_country: visitsByCountry,
          visits_by_city: visitsByCity,
          visits_today: visitsToday,
          visits_this_week: visitsThisWeek,
        });

        setRecentVisits(visits.slice(0, 20));
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center pb-20 pt-20">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 max-w-sm w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bebas text-[#1a5a7a] tracking-wide">ACCESSO ANALYTICS</h2>
            <p className="text-gray-600 text-sm mt-2">Inserisci la password per accedere</p>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Password"
                className={`text-center text-lg tracking-widest ${passwordError ? 'border-red-400 focus:border-red-400' : 'border-blue-200'}`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm text-center mt-2">Password errata</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#288cbd] to-[#1a5a7a] hover:from-[#2499d1] hover:to-[#1e6a8f] text-white rounded-xl py-3"
            >
              Accedi
            </Button>
          </form>
          
          <Link to="/impostazioni" className="block mt-4">
            <Button variant="ghost" className="w-full text-gray-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna alle impostazioni
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20 pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/impostazioni">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bebas text-[#1a5a7a] tracking-wide flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              ANALYTICS
            </h1>
            <p className="text-gray-600 text-sm">Statistiche e comportamenti utente</p>
          </div>
        </div>

        <Tabs defaultValue="visits" className="space-y-6">
          <TabsList className="bg-white shadow-md rounded-xl p-1">
            <TabsTrigger value="visits" className="rounded-lg data-[state=active]:bg-[#1a5a7a] data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              Visite
            </TabsTrigger>
            <TabsTrigger value="behavior" className="rounded-lg data-[state=active]:bg-[#1a5a7a] data-[state=active]:text-white">
              <MousePointer className="w-4 h-4 mr-2" />
              Comportamenti
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visits" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-sm text-gray-600">Visite Totali</span>
                </div>
                <p className="text-3xl font-bold text-[#1a5a7a]">{stats?.total_visits || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <span className="text-sm text-gray-600">Oggi</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{stats?.visits_today || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  <span className="text-sm text-gray-600">Ultima Settimana</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{stats?.visits_this_week || 0}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-6 h-6 text-orange-600" />
                  <span className="text-sm text-gray-600">Paesi</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{stats?.unique_countries.length || 0}</p>
              </div>
            </div>

            {/* Countries & Cities */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  VISITE PER PAESE
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats?.visits_by_country && Object.entries(stats.visits_by_country)
                    .sort((a, b) => b[1] - a[1])
                    .map(([country, count]) => (
                      <div key={country} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700">{country}</span>
                        <span className="font-semibold text-blue-600">{count}</span>
                      </div>
                    ))}
                  {(!stats?.visits_by_country || Object.keys(stats.visits_by_country).length === 0) && (
                    <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  VISITE PER CITTÀ
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stats?.visits_by_city && Object.entries(stats.visits_by_city)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 15)
                    .map(([city, count]) => (
                      <div key={city} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-700">{city}</span>
                        <span className="font-semibold text-blue-600">{count}</span>
                      </div>
                    ))}
                  {(!stats?.visits_by_city || Object.keys(stats.visits_by_city).length === 0) && (
                    <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Visits */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
              <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4">VISITE RECENTI</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-gray-600">Data</th>
                      <th className="text-left py-2 px-2 text-gray-600">Città</th>
                      <th className="text-left py-2 px-2 text-gray-600">Paese</th>
                      <th className="text-left py-2 px-2 text-gray-600">Pagina</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentVisits.map((visit) => (
                      <tr key={visit.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-2 text-gray-700">
                          {new Date(visit.created_at).toLocaleString('it-IT', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-2 px-2 text-gray-700">{visit.city || '-'}</td>
                        <td className="py-2 px-2 text-gray-700">{visit.country || '-'}</td>
                        <td className="py-2 px-2 text-gray-500 text-xs">{visit.page_path}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior">
            <EventsAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
