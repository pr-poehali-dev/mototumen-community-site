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
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({ onAuth }) => {
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
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle
          className="text-2xl"
          style={{ fontFamily: "Oswald, sans-serif" }}
        >
          Вход в МОТОТюмень
        </CardTitle>
        <CardDescription>
          Войдите через Telegram для доступа к сообществу
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleTelegramAuth}
          disabled={isLoading}
          className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white"
          size="lg"
        >
          {isLoading ? (
            <>
              <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
              Подключение...
            </>
          ) : (
            <>
              <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
              Войти через Telegram
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>Безопасный вход без паролей</p>
          <p>Все данные защищены</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelegramAuth;
