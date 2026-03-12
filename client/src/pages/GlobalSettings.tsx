import { useState, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Settings, Upload, Save, RotateCcw, Mail, Globe, MapPin, FileText } from "lucide-react";

interface GlobalSettings {
  associationName: string;
  seatCity: string;
  folio: string;
  email: string;
  website: string;
  phone: string;
  logo: string | null; // Base64 encoded logo
  description: string;
}

const DEFAULT_SETTINGS: GlobalSettings = {
  associationName: "Les Bâtisseurs Engagés",
  seatCity: "N'djaména-tchad",
  folio: "10512",
  email: "contact.lesbatisseursengages@gmail.com",
  website: "www.lesbatisseursengage.com",
  phone: "",
  logo: null,
  description: "",
};

export default function GlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("globalSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        if (parsed.logo) {
          setLogoPreview(parsed.logo);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Le logo ne doit pas dépasser 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSettings(prev => ({
        ...prev,
        logo: base64,
      }));
      setLogoPreview(base64);
      toast.success("Logo chargé avec succès");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem("globalSettings", JSON.stringify(settings));
      toast.success("Paramètres sauvegardés avec succès");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser les paramètres par défaut ?")) {
      setSettings(DEFAULT_SETTINGS);
      setLogoPreview(null);
      localStorage.removeItem("globalSettings");
      toast.success("Paramètres réinitialisés");
    }
  };

  const handleRemoveLogo = () => {
    setSettings(prev => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview(null);
    toast.success("Logo supprimé");
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <HeroSection
        title="Paramètres Globaux"
        subtitle="Gérez les informations de votre association"
        icon="⚙️"
        variant="accent"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Logo Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Logo de l'Association
            </CardTitle>
            <CardDescription>Téléchargez votre logo (max 2MB)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {logoPreview ? (
              <div className="space-y-3">
                <div className="relative w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleRemoveLogo}
                  className="w-full"
                >
                  Supprimer le logo
                </Button>
              </div>
            ) : (
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Aucun logo</p>
                </div>
              </div>
            )}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="w-full">
                Choisir un fichier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Informations de l'Association
            </CardTitle>
            <CardDescription>Mettez à jour les détails de votre association</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Association Name */}
            <div className="space-y-2">
              <Label htmlFor="associationName" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nom de l'association
              </Label>
              <Input
                id="associationName"
                name="associationName"
                value={settings.associationName}
                onChange={handleInputChange}
                placeholder="Nom de l'association"
              />
            </div>

            {/* Seat City */}
            <div className="space-y-2">
              <Label htmlFor="seatCity" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Siège social
              </Label>
              <Input
                id="seatCity"
                name="seatCity"
                value={settings.seatCity}
                onChange={handleInputChange}
                placeholder="Siège social"
              />
            </div>

            {/* Folio */}
            <div className="space-y-2">
              <Label htmlFor="folio">Folio N°</Label>
              <Input
                id="folio"
                name="folio"
                value={settings.folio}
                onChange={handleInputChange}
                placeholder="Numéro de folio"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={settings.email}
                onChange={handleInputChange}
                placeholder="Email de contact"
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Site web
              </Label>
              <Input
                id="website"
                name="website"
                value={settings.website}
                onChange={handleInputChange}
                placeholder="Site web"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                placeholder="Description de l'association"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="flex-1 gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>ℹ️ Note :</strong> Les paramètres sont sauvegardés localement dans votre navigateur. 
            Ils seront utilisés pour afficher les informations de l'association sur la page d'accueil et dans le tableau de bord.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
