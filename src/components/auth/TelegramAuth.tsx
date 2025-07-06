import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramAuthProps {
  onAuth: (user: TelegramUser) => void;
  onClose?: () => void;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuth, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramAuth = () => {
    setIsLoading(true);

    // В реальном приложении здесь будет интеграция с Telegram Login Widget
    // Для демонстрации используем мокап
    setTimeout(() => {
      const mockUser: TelegramUser = {
        id: 123456789,
        first_name: "Александр",
        last_name: "Иванов",
        username: "alex_moto",
        photo_url: "https://picsum.photos/100/100?random=user",
        auth_date: Date.now(),
        hash: "mock_hash",
      };

      onAuth(mockUser);
      setIsLoading(false);
      onClose?.();
    }, 2000);
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
          <Button
            onClick={handleTelegramAuth}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                Подключение...
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
