import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
      };
    };
  }
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export const useTelegramAuth = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTelegram = async () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;

          // Инициализируем Web App
          webApp.ready();
          webApp.expand();

          // Получаем данные пользователя
          const initData = webApp.initDataUnsafe;

          if (initData?.user) {
            const telegramUser: TelegramUser = {
              id: initData.user.id,
              first_name: initData.user.first_name,
              last_name: initData.user.last_name,
              username: initData.user.username,
              photo_url: initData.user.photo_url,
              auth_date: initData.auth_date,
              hash: initData.hash,
            };

            setUser(telegramUser);
          } else {
            // Если нет данных пользователя, создаем демо-пользователя
            const demoUser: TelegramUser = {
              id: 123456789,
              first_name: "Иван",
              last_name: "Петров",
              username: "ivan_petrov",
              photo_url: "/api/placeholder/150/150",
              auth_date: Math.floor(Date.now() / 1000),
              hash: "demo_hash",
            };
            setUser(demoUser);
          }
        } else {
          // Если не в Telegram, создаем демо-пользователя
          const demoUser: TelegramUser = {
            id: 123456789,
            first_name: "Демо",
            last_name: "Пользователь",
            username: "demo_user",
            photo_url: "/api/placeholder/150/150",
            auth_date: Math.floor(Date.now() / 1000),
            hash: "demo_hash",
          };
          setUser(demoUser);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка авторизации");
      } finally {
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);

  const logout = () => {
    setUser(null);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close();
    }
  };

  return {
    user,
    isLoading,
    error,
    logout,
    isInTelegram: !!window.Telegram?.WebApp,
  };
};
