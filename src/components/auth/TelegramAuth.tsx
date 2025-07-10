import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";

interface TelegramAuthProps {
  onAuth: () => void;
  onClose?: () => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuth, onClose }) => {
  const {
    user: telegramUser,
    isLoading,
    error,
    isInTelegram,
  } = useTelegramAuth();
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (telegramUser && !authLoading) {
      setAuthLoading(true);
      setTimeout(() => {
        onAuth();
        setAuthLoading(false);
        onClose?.();
      }, 1500);
    }
  }, [telegramUser, onAuth, onClose, authLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-dark-800 border-dark-700">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-center text-gray-400">
                Подключение к Telegram...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-dark-800 border-dark-700">
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

  if (telegramUser && authLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 bg-dark-800 border-dark-700">
          <CardHeader className="text-center">
            <CardTitle className="text-green-500">
              <Icon name="CheckCircle" className="h-8 w-8 mx-auto mb-2" />
              Авторизация успешна
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={telegramUser.photo_url || "/api/placeholder/100/100"}
                alt="Аватар"
                className="w-20 h-20 rounded-full object-cover border-4 border-accent"
              />

              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  {telegramUser.first_name} {telegramUser.last_name || ""}
                </h3>
                {telegramUser.username && (
                  <p className="text-gray-400">@{telegramUser.username}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Badge className="bg-[#0088cc]">
                  <Icon name="Send" className="h-3 w-3 mr-1" />
                  Telegram
                </Badge>
                {isInTelegram && (
                  <Badge className="bg-green-600">
                    <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                    Верифицирован
                  </Badge>
                )}
              </div>

              <p className="text-center text-gray-400 text-sm">
                Вход в систему...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleTelegramAuth = () => {
    if (telegramUser) {
      onAuth();
      onClose?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 bg-dark-800 border-dark-700">
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
          {!isInTelegram && (
            <div className="text-center mb-4">
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                <Icon name="AlertTriangle" className="h-3 w-3 mr-1" />
                Демо-режим
              </Badge>
              <p className="text-sm text-gray-500 mt-2">
                Откройте приложение в Telegram для полной функциональности
              </p>
            </div>
          )}

          <Button
            onClick={handleTelegramAuth}
            disabled={!telegramUser}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            {telegramUser ? (
              <>
                <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                Войти как {telegramUser.first_name}
              </>
            ) : (
              <>
                <Icon name="Send" className="mr-2 h-4 w-4" />
                Войти через Telegram
              </>
            )}
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

          <div className="text-center text-sm text-gray-400 pt-4 border-t border-dark-600">
            <p>Безопасный вход без паролей</p>
            <p>Все данные защищены</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramAuth;
