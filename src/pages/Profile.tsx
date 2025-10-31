import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Heart, User as UserIcon, Mail } from "lucide-react";
import { toast } from "sonner";
import { Place } from "@/lib/sheet";
import PlaceCard from "@/components/PlaceCard";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load profile data
  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
      } else if (data) {
        setFullName(data.full_name || "");
      }
    };

    loadProfile();
  }, [user]);

  // Load favorites
  useEffect(() => {
    if (!user) return;

    const loadFavorites = async () => {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("place_id")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading favorites:", error);
      } else {
        setFavorites(data.map(f => f.place_id));
      }
    };

    loadFavorites();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profilo aggiornato!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Errore nell'aggiornamento del profilo");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Caricamento...</div>
      </div>
    );
  }

  if (!user) return null;

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase()
    : user.email?.[0].toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">Il Mio Profilo</CardTitle>
            <CardDescription>Gestisci il tuo account e i tuoi luoghi preferiti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                disabled
                className="bg-muted"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Inserisci il tuo nome"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Salvataggio..." : "Salva Modifiche"}
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Esci
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Favorites Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-current" />
              I Miei Luoghi Preferiti
              <span className="text-sm text-muted-foreground font-normal">
                ({favorites.length})
              </span>
            </CardTitle>
            <CardDescription>
              Luoghi che hai salvato come preferiti
            </CardDescription>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-lg font-medium mb-2">Nessun luogo preferito</p>
                <p className="text-sm">
                  Esplora la mappa e salva i tuoi luoghi preferiti
                </p>
                <Button
                  onClick={() => navigate("/virtual-exploration")}
                  className="mt-4"
                  variant="outline"
                >
                  Esplora Ora
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Hai {favorites.length} {favorites.length === 1 ? 'luogo preferito' : 'luoghi preferiti'}
                </p>
                <Button
                  onClick={() => navigate("/virtual-exploration")}
                  variant="outline"
                >
                  Vedi sulla Mappa
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
