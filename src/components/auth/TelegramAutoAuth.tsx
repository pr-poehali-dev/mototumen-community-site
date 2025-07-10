import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

const TelegramAutoAuth: React.FC = () => {
  const { user: telegramUser, isLoading: telegramLoading } = useTelegramAuth();
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (telegramUser && !isAuthenticated && !authLoading) {
      login(telegramUser);
    }
  }, [telegramUser, isAuthenticated, authLoading, login]);

  // Компонент невидим, просто выполняет автоматическую авторизацию
  return null;
};

export default TelegramAutoAuth;
