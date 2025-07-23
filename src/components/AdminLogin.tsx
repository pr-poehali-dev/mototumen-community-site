import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/ui/icon";

interface AdminLoginProps {
  onLogin: (isAdmin: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Имитация проверки учетных данных
    setTimeout(() => {
      if (
        credentials.username === "admin" &&
        credentials.password === "moto2024"
      ) {
        onLogin(true);
      } else {
        setError("Неверные учетные данные");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-800 border-zinc-700">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" className="h-8 w-8 text-accent" />
          </div>
          <CardTitle
            className="text-2xl text-white"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Вход в админ-панель
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Введите данные для доступа к управлению сайтом
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white">
                Имя пользователя
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                className="bg-zinc-900 border-zinc-600 text-white placeholder-zinc-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                className="bg-zinc-900 border-zinc-600 text-white placeholder-zinc-400"
                required
              />
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-700 text-red-400">
                <Icon name="AlertTriangle" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Icon name="LogIn" className="h-4 w-4 mr-2" />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg">
            <p className="text-sm text-zinc-400 text-center">
              <Icon name="Info" className="h-4 w-4 inline mr-1" />
              Демо-данные: admin / moto2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
