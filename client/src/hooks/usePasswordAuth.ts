import { useState, useEffect } from "react";

const SESSION_KEY = "app_session_token";

// Identifiants par défaut (à modifier en production)
const VALID_CREDENTIALS = {
  username: "admin",
  password: "batisseurs2025"
};

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
  const login = (username: string, password: string): boolean => {
    setError(null);
    
    if (!username || !password) {
      setError("Veuillez entrer l'identifiant et le mot de passe");
      return false;
    }

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      const token = Math.random().toString(36).substring(2);
      sessionStorage.setItem(SESSION_KEY, token);
      setIsAuthenticated(true);
      return true;
    } else {
      setError("Identifiant ou mot de passe incorrect");
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
