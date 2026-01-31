import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye, EyeOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role: "admin" | "membre";
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Données d'exemple
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@batisseurs-engages.fr",
    fullName: "Administrateur",
    role: "admin",
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date("2025-01-01"),
  },
  {
    id: 2,
    username: "marie.dupont",
    email: "marie@batisseurs-engages.fr",
    fullName: "Marie Dupont",
    role: "membre",
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2025-01-15"),
  },
  {
    id: 3,
    username: "jean.martin",
    email: "jean@batisseurs-engages.fr",
    fullName: "Jean Martin",
    role: "membre",
    isActive: true,
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date("2025-01-20"),
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(SAMPLE_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "membre" as const,
  });

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (users.some((u) => u.username === newUser.username)) {
      toast.error("Cet identifiant existe déjà");
      return;
    }

    const user: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      ...newUser,
      isActive: true,
      createdAt: new Date(),
    };

    setUsers([...users, user]);
    setNewUser({ username: "", email: "", fullName: "", role: "membre" });
    toast.success("Utilisateur créé avec succès");
  };

  const handleDeleteUser = (id: number) => {
    if (id === 1) {
      toast.error("Vous ne pouvez pas supprimer l'administrateur principal");
      return;
    }

    setUsers(users.filter((u) => u.id !== id));
    toast.success("Utilisateur supprimé");
  };

  const handleToggleActive = (id: number) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, isActive: !u.isActive } : u
      )
    );
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copié dans le presse-papiers");
  };

  const getRoleBadgeColor = (role: string) => {
    return role === "admin" ? "destructive" : "secondary";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les identifiants et mots de passe des membres du bureau exécutif
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouvel utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Identifiant *</label>
                <Input
                  placeholder="Ex: marie.dupont"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  placeholder="Ex: marie@example.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom complet</label>
                <Input
                  placeholder="Ex: Marie Dupont"
                  value={newUser.fullName}
                  onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rôle</label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="membre">Membre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">
                Créer l'utilisateur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Input
        placeholder="Rechercher par identifiant, nom ou email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Identifiant</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rôle</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Dernière connexion</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                    <td className="px-4 py-3 text-sm">{user.fullName || "-"}</td>
                    <td className="px-4 py-3 text-sm">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={getRoleBadgeColor(user.role)}>
                        {user.role === "admin" ? "Admin" : "Membre"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={user.isActive ? "default" : "outline"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.lastLogin ? formatDate(user.lastLogin) : "Jamais"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier l'utilisateur</DialogTitle>
                              <DialogDescription>
                                Gérez les paramètres de {user.username}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">Mot de passe généré</label>
                                <div className="flex gap-2">
                                  <Input
                                    type={showPassword[user.id] ? "text" : "password"}
                                    value={generatePassword()}
                                    readOnly
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowPassword({ ...showPassword, [user.id]: !showPassword[user.id] })}
                                  >
                                    {showPassword[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(generatePassword(), user.id)}
                                  >
                                    {copiedId === user.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </div>
                              <Button
                                variant={user.isActive ? "outline" : "default"}
                                onClick={() => handleToggleActive(user.id)}
                                className="w-full"
                              >
                                {user.isActive ? "Désactiver" : "Activer"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Administrateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Utilisateurs actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.isActive).length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
