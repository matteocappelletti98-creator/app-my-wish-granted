import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, Lock } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Accesso effettuato",
          description: "Benvenuto!",
        });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Registrazione completata",
          description: "Controlla la tua email per confermare l'account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/30 relative overflow-hidden pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-8">
        <div className="mx-auto max-w-md">
          {/* Back Button */}
          <Link to="/">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Indietro</span>
            </button>
          </Link>

          {/* Auth Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-blue-100/50 shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light text-blue-900 mb-2">
                {isLogin ? "Accedi" : "Registrati"}
              </h1>
              <p className="text-blue-600/70 text-sm">
                {isLogin
                  ? "Bentornato! Accedi al tuo account"
                  : "Crea un nuovo account per iniziare"}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-900">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tua@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-900">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/50 border-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading
                  ? "Caricamento..."
                  : isLogin
                  ? "Accedi"
                  : "Registrati"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isLogin
                  ? "Non hai un account? Registrati"
                  : "Hai già un account? Accedi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
