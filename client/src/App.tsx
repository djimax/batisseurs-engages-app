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
import Finance from "./pages/Finance";
import Offline from "./pages/Offline";
import ModeSelector from "./pages/ModeSelector";
import Settings from "./pages/Settings";
import Campaigns from "./pages/Campaigns";
import Adhesions from "./pages/Adhesions";
import { useState, useEffect } from "react";

function OnlineRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
      <Route path="/documents" component={Documents} />
      <Route path="/categories" component={Categories} />
      <Route path="/members" component={Members} />
      <Route path="/activity" component={Activity} />
      <Route path="/archives" component={Archives} />
      <Route path="/finance" component={Finance} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/adhesions" component={Adhesions} />
      <Route path="/settings" component={Settings} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function OfflineRouter() {
  return (
    <Switch>
      <Route path="*" component={() => <Offline />} />
    </Switch>
  );
}

function Router({ mode, onChangeMode }: { mode: 'online' | 'offline' | null; onChangeMode: (mode: 'online' | 'offline') => void }) {
  if (mode === null) {
    return (
      <ModeSelector
        onSelectMode={(selectedMode) => {
          localStorage.setItem('appMode', selectedMode);
          onChangeMode(selectedMode);
        }}
      />
    );
  }

  if (mode === 'offline') {
    return <OfflineRouter />;
  }

  return <OnlineRouter />;
}

function App() {
  const [mode, setMode] = useState<'online' | 'offline' | null>(null);

  useEffect(() => {
    const savedMode = localStorage.getItem('appMode') as 'online' | 'offline' | null;
    setMode(savedMode);
  }, []);

  const handleChangeMode = (newMode: 'online' | 'offline') => {
    setMode(newMode);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router mode={mode} onChangeMode={handleChangeMode} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
