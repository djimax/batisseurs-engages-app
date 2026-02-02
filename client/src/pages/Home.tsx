import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  FolderOpen,
  Users,
  ArrowRight,
  Plus,
  Sparkles,
  Activity
} from "lucide-react";
import { useLocation } from "wouter";
import { RoleSelector } from "@/components/RoleSelector";
import { useRole } from "@/hooks/useRole";
import { useCurrency } from "@/contexts/CurrencyContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAdmin } = useRole();
  const { data: stats, isLoading: statsLoading } = trpc.documents.stats.useQuery();
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();
  const { data: documents, isLoading: documentsLoading } = trpc.documents.list.useQuery({});

  const recentDocs = documents?.slice(0, 5) || [];
  const urgentDocs = documents?.filter(d => d.priority === "urgent" && d.status !== "completed") || [];

  const statCards = [
    {
      title: "Total Documents",
      value: stats?.total || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Complétés",
      value: stats?.completed || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "En cours",
      value: stats?.inProgress || 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "En attente",
      value: stats?.pending || 0,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      gradient: "from-amber-500 to-amber-600",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-completed">Complété</Badge>;
      case "in-progress":
        return <Badge className="status-in-progress">En cours</Badge>;
      default:
        return <Badge className="status-pending">En attente</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="priority-urgent">Urgent</Badge>;
      case "high":
        return <Badge className="priority-high">Haute</Badge>;
      case "medium":
        return <Badge className="priority-medium">Moyenne</Badge>;
      default:
        return <Badge className="priority-low">Basse</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* 🎨 HERO SECTION avec gradient */}
      <div className="gradient-hero rounded-3xl p-8 text-white shadow-2xl animate-fade-in-up">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Bienvenue sur votre Portail
              </h1>
            </div>
            <p className="text-blue-100 text-lg max-w-2xl">
              Plateforme complète de gestion documentaire, financière et administrative pour votre association
            </p>
            
            {/* Mini stats inline dans le hero */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                  <p className="text-xs text-blue-200">Documents</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-200" />
                <div>
                  <p className="text-2xl font-bold">{categories?.length || 0}</p>
                  <p className="text-xs text-blue-200">Catégories</p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setLocation("/documents")} 
            className="bg-white text-blue-600 hover:bg-blue-50 gap-2 shadow-lg btn-glow h-12 px-6"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Nouveau document
          </Button>
        </div>
      </div>

      {/* Role Selector (Dev) */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 animate-fade-in-up delay-1">
        <RoleSelector />
      </div>

      {/* 📊 STATS GRID - Cartes avec animations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 animate-slide-in-right">
          <TrendingUp className="h-6 w-6 text-primary" />
          Statistiques en Direct
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-10 rounded-xl" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat, index) => (
              <Card 
                key={stat.title} 
                className={`card-hover overflow-hidden relative animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient subtle en arrière-plan */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
                
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-3 rounded-xl ${stat.bgColor} transition-transform hover:scale-110`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 🚨 URGENT DOCUMENTS - Avec animation pulse */}
      {urgentDocs.length > 0 && (
        <Card className="border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50/80 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 animate-fade-in-up shadow-lg shadow-red-500/10" style={{ animationDelay: `0.5s` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 animate-pulse" />
              </div>
              <CardTitle className="text-lg text-red-800 dark:text-red-300">
                🔥 Documents urgents ({urgentDocs.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {urgentDocs.slice(0, 3).map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center justify-between p-4 bg-white dark:bg-card rounded-xl border border-red-100 dark:border-red-900/30 hover:shadow-md transition-all cursor-pointer card-hover"
                  onClick={() => setLocation("/documents")}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
                      <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">{doc.title}</span>
                  </div>
                  {getStatusBadge(doc.status)}
                </div>
              ))}
              {urgentDocs.length > 3 && (
                <Button 
                  variant="ghost" 
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                  onClick={() => setLocation("/documents")}
                >
                  Voir tous les documents urgents ({urgentDocs.length - 3} de plus)
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 📂 OVERVIEW SECTION */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 animate-slide-in-right">
          <FolderOpen className="h-6 w-6 text-primary" />
          Vue d'Ensemble
        </h2>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* 📄 Recent Documents - Card avec glassmorphism */}
          <Card className="glass-card card-hover animate-fade-in-up delay-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Documents récents
                </CardTitle>
                <CardDescription>Les derniers documents modifiés</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLocation("/documents")}
                className="hover:bg-primary/10"
              >
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentDocs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Aucun document</p>
              ) : (
                <div className="space-y-3">
                  {recentDocs.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setLocation("/documents")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.title}</p>
                          <p className="text-xs text-muted-foreground">ID: {doc.categoryId}</p>
                        </div>
                      </div>
                      {getPriorityBadge(doc.priority)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 📊 Quick Stats */}
          <Card className="glass-card card-hover animate-fade-in-up delay-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Accès Rapide
              </CardTitle>
              <CardDescription>Accédez rapidement aux sections principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12"
                onClick={() => setLocation("/documents")}
              >
                <FileText className="h-4 w-4" />
                Documents
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12"
                onClick={() => setLocation("/members")}
              >
                <Users className="h-4 w-4" />
                Membres
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 h-12"
                onClick={() => setLocation("/finance")}
              >
                <TrendingUp className="h-4 w-4" />
                Finance
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 h-12"
                  onClick={() => setLocation("/user-management")}
                >
                  <Users className="h-4 w-4" />
                  Gestion Utilisateurs
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
