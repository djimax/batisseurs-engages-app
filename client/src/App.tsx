import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import Documents from "./pages/Documents";
import Categories from "./pages/Categories";
import Members from "./pages/Members";
import Activity from "./pages/Activity";
import Archives from "./pages/Archives";
import Offline from "./pages/Offline";
import { useState, useEffect } from "react";

function Router() {
  const [isOfflineMode] = useState(() => {
    return localStorage.getItem('offlineMode') === 'true';
  });

  if (isOfflineMode) {
    return (
      <Switch>
        <Route path="*" component={() => <Offline />} />
      </Switch>
    );
  }

  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/documents" component={Documents} />
        <Route path="/categories" component={Categories} />
        <Route path="/members" component={Members} />
        <Route path="/activity" component={Activity} />
        <Route path="/archives" component={Archives} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  useEffect(() => {
    // Enable offline mode by default for local usage
    localStorage.setItem('offlineMode', 'true');
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
