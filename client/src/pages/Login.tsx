import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  error?: string | null;
  onForgotPassword?: () => void;
}

export default function Login({ onLogin, error, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onLogin(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Les Bâtisseurs Engagés" className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl">Les Bâtisseurs Engagés</CardTitle>
          <CardDescription>
            Plateforme de gestion d'association
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e as any);
                    }
                  }}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Avez-vous oublié vos identifiants ?
                </p>
                {onForgotPassword && (
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !password}
              size="lg"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground">
              Cette application est protégée par authentification.
              <br />
              Accès réservé aux membres de l'association.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
