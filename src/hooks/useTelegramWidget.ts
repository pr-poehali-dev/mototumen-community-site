import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

declare global {
  interface Window {
    TelegramLoginWidget?: {
      dataOnauth: (user: any) => void;
    };
  }
}

export interface TelegramWidgetUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export const useTelegramWidget = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const createTelegramWidget = (containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Очищаем контейнер
    container.innerHTML = "";

    // Создаем элемент для Telegram Login Widget
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "@auth_mototyumen_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    script.setAttribute("data-radius", "8");

    container.appendChild(script);

    // Создаем глобальную функцию для обработки авторизации
    (window as any).onTelegramAuth = async (user: TelegramWidgetUser) => {
      setIsLoading(true);
      setError(null);

      try {
        // Преобразуем данные в формат, который ожидает AuthContext
        const telegramUser = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          auth_date: user.auth_date,
          hash: user.hash,
        };

        await login(telegramUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка авторизации");
      } finally {
        setIsLoading(false);
      }
    };
  };

  const loginWithPopup = () => {
    setIsLoading(true);
    setError(null);

    const botUsername = "@auth_mototyumen_bot";
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent(window.location.href)}`;

    const popup = window.open(
      authUrl,
      "telegram-auth",
      "width=400,height=500,scrollbars=yes,resizable=yes",
    );

    if (!popup) {
      setError("Не удалось открыть окно авторизации");
      setIsLoading(false);
      return;
    }

    // Слушаем сообщения от popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== "https://oauth.telegram.org") return;

      try {
        const userData = event.data;
        if (userData && userData.id) {
          await login(userData);
          popup.close();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка авторизации");
      } finally {
        setIsLoading(false);
        window.removeEventListener("message", handleMessage);
      }
    };

    window.addEventListener("message", handleMessage);

    // Проверяем, закрыто ли окно
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  };

  const loginWithRedirect = () => {
    const botUsername = "@auth_mototyumen_bot";
    const returnUrl = `${window.location.origin}/auth-callback`;
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botUsername}&origin=${encodeURIComponent(window.location.origin)}&return_to=${encodeURIComponent(returnUrl)}`;

    window.location.href = authUrl;
  };

  useEffect(() => {
    // Очищаем глобальную функцию при размонтировании
    return () => {
      if ((window as any).onTelegramAuth) {
        delete (window as any).onTelegramAuth;
      }
    };
  }, []);

  return {
    createTelegramWidget,
    loginWithPopup,
    loginWithRedirect,
    isLoading,
    error,
  };
};