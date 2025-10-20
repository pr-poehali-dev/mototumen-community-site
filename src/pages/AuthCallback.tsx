import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Получаем параметры из URL
        const telegramData = {
          id: Number(searchParams.get("id")),
          first_name: searchParams.get("first_name") || "",
          last_name: searchParams.get("last_name") || undefined,
          username: searchParams.get("username") || undefined,
          photo_url: searchParams.get("photo_url") || undefined,
          auth_date: Number(searchParams.get("auth_date")),
          hash: searchParams.get("hash") || "",
        };

        // Проверяем наличие обязательных данных
        if (
          !telegramData.id ||
          !telegramData.first_name ||
          !telegramData.hash
        ) {
          throw new Error("Неполные данные авторизации");
        }

        setUserData(telegramData);

        // Выполняем авторизацию
        await login(telegramData);

        // Перенаправляем на главную страницу через 2 секунды
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка авторизации");
      } finally {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [searchParams, login, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              <p className="text-center text-gray-400">
                Обработка данных авторизации...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-red-500">
              <Icon name="AlertCircle" className="h-8 w-8 mx-auto mb-2" />
              Ошибка авторизации
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-400">{error}</p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/")}
                className="w-full bg-accent hover:bg-accent/90"
              >
                <Icon name="ArrowLeft" className="mr-2" size={20} />
                На главную
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full border-dark-600 text-gray-300 hover:bg-dark-700"
              >
                Попробовать снова
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-green-500">
            <Icon name="CheckCircle" className="h-8 w-8 mx-auto mb-2" />
            Авторизация успешна
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData && (
            <div className="flex flex-col items-center space-y-4">
              <img
                src={userData.photo_url || "/api/placeholder/100/100"}
                alt="Аватар"
                className="w-20 h-20 rounded-full object-cover border-4 border-accent"
              />

              <div className="text-center">
                <h3 className="text-xl font-bold">
                  {userData.first_name} {userData.last_name || ""}
                </h3>
                {userData.username && (
                  <p className="text-gray-400">@{userData.username}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Badge className="bg-[#0088cc]">
                  <Icon name="Send" className="h-3 w-3 mr-1" />
                  Telegram ID: {userData.id}
                </Badge>
                <Badge className="bg-green-600">
                  <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                  Верифицирован
                </Badge>
              </div>

              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  Перенаправление на главную страницу...
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-accent h-2 rounded-full transition-all duration-2000"
                    style={{ width: "100%" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={() => navigate("/")}
            className="w-full bg-accent hover:bg-accent/90"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            На главную
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;