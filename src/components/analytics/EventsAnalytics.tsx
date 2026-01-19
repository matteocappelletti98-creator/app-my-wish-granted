import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MousePointer, TrendingUp, Clock, Activity, FileText } from "lucide-react";

interface EventStats {
  total_events: number;
  unique_sessions: number;
  clicks_by_element: Record<string, number>;
  events_by_type: Record<string, number>;
  top_pages: Record<string, number>;
  article_views: Record<string, { count: number; title: string }>;
}

interface UserEvent {
  id: string;
  created_at: string;
  session_id: string | null;
  event_type: string;
  event_name: string;
  event_data: Record<string, unknown> | null;
  page_path: string | null;
  element_id: string | null;
  element_text: string | null;
}

export function EventsAnalytics() {
  const [stats, setStats] = useState<EventStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventAnalytics();
  }, []);

  const loadEventAnalytics = async () => {
    try {
      const { data: events, error } = await (supabase.from('user_events' as any) as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      if (events) {
        const uniqueSessions = new Set(events.map((e: UserEvent) => e.session_id)).size;
        const clicksByElement: Record<string, number> = {};
        const eventsByType: Record<string, number> = {};
        const topPages: Record<string, number> = {};
        const articleViews: Record<string, { count: number; title: string }> = {};

        events.forEach((event: UserEvent) => {
          // Count by event type
          eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;

          // Count clicks by element name
          if (event.event_type === 'click') {
            const name = event.event_name.replace('button_', '').replace('link_', '').slice(0, 30);
            clicksByElement[name] = (clicksByElement[name] || 0) + 1;
          }

          // Count article views
          if (event.event_type === 'article_view' && event.page_path) {
            const slug = event.page_path.replace('/articolo/', '');
            const title = (event.event_data as any)?.article_title || slug;
            if (!articleViews[slug]) {
              articleViews[slug] = { count: 0, title };
            }
            articleViews[slug].count++;
          }

          // Count by page
          if (event.page_path) {
            topPages[event.page_path] = (topPages[event.page_path] || 0) + 1;
          }
        });

        setStats({
          total_events: events.length,
          unique_sessions: uniqueSessions,
          clicks_by_element: clicksByElement,
          events_by_type: eventsByType,
          top_pages: topPages,
          article_views: articleViews,
        });

        setRecentEvents(events.slice(0, 30) as UserEvent[]);
      }
    } catch (error) {
      console.error('Error loading event analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 text-pink-600" />
            <span className="text-sm text-gray-600">Eventi Totali</span>
          </div>
          <p className="text-3xl font-bold text-pink-600">{stats?.total_events || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <span className="text-sm text-gray-600">Sessioni</span>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats?.unique_sessions || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <div className="flex items-center gap-3 mb-2">
            <MousePointer className="w-6 h-6 text-amber-600" />
            <span className="text-sm text-gray-600">Click</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats?.events_by_type?.click || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-teal-100">
          <div className="flex items-center gap-3 mb-2">
          <Clock className="w-6 h-6 text-teal-600" />
            <span className="text-sm text-gray-600">Navigazioni</span>
          </div>
          <p className="text-3xl font-bold text-teal-600">{stats?.events_by_type?.navigation || 0}</p>
        </div>
      </div>

      {/* Article Views */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
        <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          LETTURE ARTICOLI
        </h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {stats?.article_views && Object.entries(stats.article_views)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([slug, data]) => (
              <div key={slug} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700 text-sm truncate max-w-[250px]">{data.title}</span>
                <span className="font-semibold text-blue-600">{data.count} letture</span>
              </div>
            ))}
          {(!stats?.article_views || Object.keys(stats.article_views).length === 0) && (
            <p className="text-gray-500 text-sm">Nessun articolo letto ancora</p>
          )}
        </div>
      </div>

      {/* Top Clicked Elements & Pages */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4 flex items-center gap-2">
            <MousePointer className="w-5 h-5" />
            ELEMENTI PIÙ CLICCATI
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats?.clicks_by_element && Object.entries(stats.clicks_by_element)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 15)
              .map(([element, count]) => (
                <div key={element} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 text-sm truncate max-w-[200px]">{element}</span>
                  <span className="font-semibold text-pink-600">{count}</span>
                </div>
              ))}
            {(!stats?.clicks_by_element || Object.keys(stats.clicks_by_element).length === 0) && (
              <p className="text-gray-500 text-sm">Nessun dato disponibile (inizia a navigare l'app!)</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
          <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            PAGINE PIÙ VISITATE
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats?.top_pages && Object.entries(stats.top_pages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([page, count]) => (
                <div key={page} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 text-sm">{page}</span>
                  <span className="font-semibold text-indigo-600">{count}</span>
                </div>
              ))}
            {(!stats?.top_pages || Object.keys(stats.top_pages).length === 0) && (
              <p className="text-gray-500 text-sm">Nessun dato disponibile</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
        <h2 className="text-xl font-bebas text-[#1a5a7a] mb-4">EVENTI RECENTI</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-600">Ora</th>
                <th className="text-left py-2 px-2 text-gray-600">Tipo</th>
                <th className="text-left py-2 px-2 text-gray-600">Evento</th>
                <th className="text-left py-2 px-2 text-gray-600">Pagina</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-700">
                    {new Date(event.created_at).toLocaleString('it-IT', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.event_type === 'click' ? 'bg-pink-100 text-pink-700' :
                      event.event_type === 'navigation' ? 'bg-indigo-100 text-indigo-700' :
                      event.event_type === 'form' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.event_type}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-gray-700 max-w-[200px] truncate">
                    {event.event_name.replace('button_', '').replace('link_', '')}
                  </td>
                  <td className="py-2 px-2 text-gray-500 text-xs">{event.page_path}</td>
                </tr>
              ))}
              {recentEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    Nessun evento registrato. Inizia a navigare l'app per vedere i dati!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
