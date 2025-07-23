import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramAuthSimpleProps {
  onAuth: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

const TelegramAuthSimple: React.FC<TelegramAuthSimpleProps> = ({ onAuth, onClose }) => {
  const { login } = useAuth();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Функция обработки авторизации через Telegram
    window.onTelegramAuth = async (user: TelegramUser) => {
      try {
        console.log('Telegram auth successful:', user);
        await login(user);
        onAuth();
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    // Создаем скрипт для Telegram Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', 'auth_mototyumen_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-lang', 'ru');
    script.setAttribute('data-corner-radius', '8');
    script.async = true;

    scriptRef.current = script;

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Очищаем при размонтировании
      if (scriptRef.current && containerRef.current && containerRef.current.contains(scriptRef.current)) {
        containerRef.current.removeChild(scriptRef.current);
      }
      delete window.onTelegramAuth;
    };
  }, [login, onAuth]);

  // Простая демо-авторизация для тестирования
  const handleDemoAuth = async () => {
    const demoUser: TelegramUser = {
      id: 123456789,
      first_name: "Демо",
      last_name: "Пользователь", 
      username: "demo_user",
      photo_url: "https://cdn.poehali.dev/files/972cbcb6-2462-43d5-8df9-3cc8a591f756.png",
      auth_date: Math.floor(Date.now() / 1000),
      hash: "demo_hash"
    };
    
    try {
      await login(demoUser);
      onAuth();
    } catch (error) {
      console.error('Demo auth error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-dark-800 border-dark-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Send" className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl font-['Oswald']">
            Вход в МОТО<span className="text-[#004488]">ТЮМЕНЬ</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Войдите через Telegram для доступа к сообществу
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Telegram Widget Container */}
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-600">
            <p className="text-sm text-gray-400 mb-3 text-center">
              Официальный Telegram Login Widget:
            </p>
            <div 
              ref={containerRef}
              className="flex justify-center items-center min-h-[60px]"
              id="telegram-login-widget-simple"
            />
          </div>

          {/* Demo Button для тестирования */}
          <Button
            onClick={handleDemoAuth}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            <Icon name="User" className="mr-2 h-4 w-4" />
            Демо авторизация
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-dark-600 text-gray-300 hover:bg-dark-700"
            >
              <Icon name="X" className="mr-2 h-4 w-4" />
              Отмена
            </Button>
          )}

          <div className="text-center text-sm text-gray-400 pt-4 border-t border-dark-600">
            <p>Безопасный вход через Telegram</p>
            <p className="text-xs mt-2">Бот: @auth_mototyumen_bot</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthSimple;