import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

interface TelegramAuthProps {
  onAuth: (user: TelegramUser) => void;
  isAuthenticated: boolean;
}

const TelegramAuth: React.FC<TelegramAuthProps> = ({
  onAuth,
  isAuthenticated,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTelegramAuth = () => {
    setIsLoading(true);

    // Симуляция авторизации через Telegram
    setTimeout(() => {
      const mockUser: TelegramUser = {
        id: 123456789,
        first_name: "Алексей",
        last_name: "Мотоциклист",
        username: "motobiker72",
        photo_url: "https://via.placeholder.com/64x64/FF6B35/FFFFFF?text=AM",
        auth_date: Math.floor(Date.now() / 1000),
      };

      onAuth(mockUser);
      setIsLoading(false);
    }, 1500);
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-zinc-700">
          <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
          Войти через Telegram
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle
            className="text-center"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Авторизация через Telegram
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="MessageCircle" className="h-8 w-8 text-accent" />
          </div>
          <p
            className="text-zinc-300 mb-6"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Войдите через Telegram, чтобы получить доступ к личному кабинету и
            всем возможностям сообщества
          </p>
          <Button
            onClick={handleTelegramAuth}
            disabled={isLoading}
            className="bg-accent hover:bg-accent/90 text-white w-full"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                Подключение...
              </>
            ) : (
              <>
                <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                Авторизоваться в Telegram
              </>
            )}
          </Button>
          <p className="text-xs text-zinc-500 mt-4">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TelegramAuth;
