import { useState, useEffect } from "react";

const SESSION_KEY = "app_session_token";
const DEFAULT_PASSWORD = "batisseurs2025"; // À changer en production

export function usePasswordAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_KEY);
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Fonction de connexion
  const login = (password: string): boolean => {
    setError(null);
    
    if (!password) {
      setError("Veuillez entrer un mot de passe");
      return false;
    }

    if (password === DEFAULT_PASSWORD) {
      const token = Math.random().toString(36).substring(2);
      sessionStorage.setItem(SESSION_KEY, token);
      setIsAuthenticated(true);
      return true;
    } else {
      setError("Mot de passe incorrect");
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setError(null);
  };

  return {
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
