import { useState, useCallback } from "react";

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export interface AuthState {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  showAdminLogin: boolean;
  showAdminPanel: boolean;
}

export interface AuthHandlers {
  handleAuth: (userData: TelegramUser) => void;
  handleLogout: () => void;
  handleAdminLogin: (adminStatus: boolean) => void;
  handleAdminLogout: () => void;
  setShowAdminLogin: (show: boolean) => void;
  setShowAdminPanel: (show: boolean) => void;
}

export const useAuth = (): AuthState & AuthHandlers => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handleAuth = useCallback((userData: TelegramUser) => {
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleAdminLogin = useCallback((adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setShowAdminLogin(false);
    if (adminStatus) {
      setShowAdminPanel(true);
    }
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isAdmin,
    showAdminLogin,
    showAdminPanel,
    handleAuth,
    handleLogout,
    handleAdminLogin,
    handleAdminLogout,
    setShowAdminLogin,
    setShowAdminPanel,
  };
};
