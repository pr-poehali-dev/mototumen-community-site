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
  const { loginWithTelegram } = useAuth();
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Функция обработки авторизации через Telegram
    window.onTelegramAuth = async (user: TelegramUser) => {
      try {
        console.log('Telegram auth successful:', user);
        await loginWithTelegram(user);
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
  }, [loginWithTelegram, onAuth]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card 
        className="relative w-full max-w-md border-dark-700 overflow-hidden"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/a2a70bde-ed21-44f5-a4cd-f00989a0d571.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <CardHeader className="relative text-center z-10 pb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Icon name="Send" className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <CardTitle className="text-white text-xl sm:text-2xl font-['Oswald']">
            Вход в МОТО<span className="text-[#004488]">ТЮМЕНЬ</span>
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Войдите через Telegram для доступа к сообществу
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative space-y-3 sm:space-y-4 z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/20">
            <div 
              ref={containerRef}
              className="flex justify-center items-center min-h-[60px]"
              id="telegram-login-widget-simple"
            />
          </div>

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-white/30 text-gray-300 hover:bg-black/30 backdrop-blur-sm bg-black/20 text-sm sm:text-base"
            >
              <Icon name="X" className="mr-2 h-4 w-4" />
              Отмена
            </Button>
          )}

          <div className="text-center text-xs sm:text-sm text-gray-300 pt-3 sm:pt-4 border-t border-white/20">
            <p>Безопасный вход через Telegram</p>
            <p className="text-xs mt-2">Бот: @auth_mototyumen_bot</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuthSimple;