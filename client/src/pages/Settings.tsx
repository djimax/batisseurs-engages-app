import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SettingsIcon, LogOut, Moon, Sun, Globe, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Settings() {
  const [, setLocation] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentMode, setCurrentMode] = useState<'online' | 'offline'>('offline');

  useEffect(() => {
    const savedMode = localStorage.getItem('appMode') as 'online' | 'offline' | null;
    if (savedMode) {
      setCurrentMode(savedMode);
    }
  }, []);

  const handleChangeMode = () => {
    const newMode = currentMode === 'online' ? 'offline' : 'online';
    localStorage.setItem('appMode', newMode);
    toast.success(`Mode changé en: ${newMode === 'online' ? 'En Ligne' : 'Hors Ligne'}`);
    // Recharger la page pour appliquer le changement
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('offlineUser');
    localStorage.removeItem('appMode');
    toast.success('Déconnexion réussie');
    setLocation('/');
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast.success(`Thème ${!darkMode ? 'sombre' : 'clair'} activé`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos préférences et configuration</p>
        </div>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentMode === 'online' ? (
              <Globe className="w-5 h-5 text-blue-600" />
            ) : (
              <Wifi className="w-5 h-5 text-green-600" />
            )}
            Mode Actuel
          </CardTitle>
          <CardDescription>
            Vous utilisez actuellement le mode <strong>{currentMode === 'online' ? 'En Ligne' : 'Hors Ligne'}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {currentMode === 'online' 
                ? '✅ Mode En Ligne : Vos données sont synchronisées avec le serveur cloud.'
                : '✅ Mode Hors Ligne : Vos données sont stockées localement sur cet ordinateur.'}
            </p>
          </div>
          <Button
            onClick={handleChangeMode}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {currentMode === 'online' ? (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Passer au Mode Hors Ligne
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Passer au Mode En Ligne
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Apparence
          </CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-600" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <label htmlFor="dark-mode" className="cursor-pointer">
                Mode Sombre
              </label>
            </div>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={handleToggleDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <Card>
        <CardHeader>
          <CardTitle>À Propos</CardTitle>
          <CardDescription>
            Informations sur l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Application</p>
              <p className="font-semibold">Les Bâtisseurs Engagés</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Version</p>
              <p className="font-semibold">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="font-semibold">
                {currentMode === 'online' ? 'En Ligne' : 'Hors Ligne'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stockage</p>
              <p className="font-semibold">
                {currentMode === 'online' ? 'Cloud' : 'Local'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Zone Dangereuse</CardTitle>
          <CardDescription>
            Actions irréversibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Vous serez redirigé vers la page de sélection de mode.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
