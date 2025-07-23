import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useTelegramWidget } from "@/hooks/useTelegramWidget";

interface TelegramAuthProps {
  onAuth: () => void;
  onClose?: () => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuth, onClose }) => {
  const {
    createTelegramWidget,
    loginWithPopup,
    loginWithRedirect,
    isLoading,
    error,
  } = useTelegramWidget();
  const [showWidget, setShowWidget] = useState(false);

  useEffect(() => {
    if (showWidget) {
      createTelegramWidget("telegram-login-widget");
    }
  }, [showWidget, createTelegramWidget]);

  if (error) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          backgroundImage: 'url(https://cdn.poehali.dev/files/0db1993c-885f-4f4e-a09a-94c04964350f.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <Card className="relative w-full max-w-md mx-4 bg-dark-800 border-dark-700">
          <CardHeader className="text-center">
            <CardTitle className="text-red-500">
              <Icon name="AlertCircle" className="h-8 w-8 mx-auto mb-2" />
              Ошибка авторизации
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-accent hover:bg-accent/90"
            >
              Попробовать снова
            </Button>
            {onClose && (
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full border-dark-600 text-gray-300 hover:bg-dark-700"
              >
                Отмена
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: 'url(https://cdn.poehali.dev/files/0db1993c-885f-4f4e-a09a-94c04964350f.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <Card className="relative w-full max-w-md mx-4 bg-dark-800 border-dark-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Send" className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-white text-2xl font-['Oswald']">
            Вход в МОТО<span className="text-orange-500">ТЮМЕНЬ</span>
          </CardTitle>
          <CardDescription className="text-gray-400">
            Войдите через Telegram для доступа к сообществу
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Telegram Login Widget */}
          {showWidget && (
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-3">
                  Официальный Telegram Login Widget:
                </p>
                <div
                  id="telegram-login-widget"
                  className="flex justify-center min-h-[50px] border border-gray-600 rounded-lg p-3"
                ></div>
              </div>
              <Button
                onClick={() => setShowWidget(false)}
                variant="outline"
                size="sm"
                className="w-full border-dark-600 text-gray-300 hover:bg-dark-700"
              >
                <Icon name="X" className="h-4 w-4 mr-2" />
                Скрыть виджет
              </Button>
            </div>
          )}

          {!showWidget && (
            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={() => setShowWidget(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
                disabled={isLoading}
              >
                <Icon name="Send" className="mr-2 h-4 w-4" />
                Telegram Login Widget
              </Button>

              <Button
                onClick={loginWithPopup}
                variant="outline"
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon name="ExternalLink" className="mr-2 h-4 w-4" />
                )}
                Popup авторизация
              </Button>

              <Button
                onClick={loginWithRedirect}
                variant="outline"
                className="w-full border-gray-500 text-gray-300 hover:bg-gray-500 hover:text-white"
                size="lg"
              >
                <Icon name="ArrowRight" className="mr-2 h-4 w-4" />
                Перенаправление
              </Button>
            </div>
          )}

          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-dark-600 text-gray-300 hover:bg-dark-700"
            >
              Отмена
            </Button>
          )}

          <div className="text-center text-sm text-gray-400 pt-4 border-t border-dark-600">
            <p>Безопасный вход без паролей</p>
            <p>Все данные защищены</p>
            <p className="text-xs mt-2">Бот: @auth_mototyumen_bot</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuth;