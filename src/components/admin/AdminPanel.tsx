import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    // Простая проверка учетных данных
    if (loginData.username === "anthonygenevezy" && loginData.password === "224753") {
      setIsAuthenticated(true);
    } else {
      setLoginError("Неверный логин или пароль");
    }
    
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: "", password: "" });
    setLoginError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isAuthenticated ? "Админ панель" : "Вход в админ панель"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icon name="X" className="h-5 w-5" />
          </Button>
        </div>

        {/* Контент */}
        <div className="p-6">
          {!isAuthenticated ? (
            // Форма входа
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  placeholder="Введите логин"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  placeholder="Введите пароль"
                  className="mt-1"
                  required
                />
              </div>

              {loginError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#004488] hover:bg-blue-700"
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
          ) : (
            // Панель администратора
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Icon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Успешная авторизация
                  </span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Добро пожаловать, {loginData.username}!
                </p>
              </div>

              {/* Панель управления */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Панель управления
                </h3>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert("Функция в разработке")}
                >
                  <Icon name="Settings" className="h-4 w-4 mr-2" />
                  Настройки сайта
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert("Функция в разработке")}
                >
                  <Icon name="Users" className="h-4 w-4 mr-2" />
                  Управление пользователями
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert("Функция в разработке")}
                >
                  <Icon name="FileText" className="h-4 w-4 mr-2" />
                  Управление контентом
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert("Функция в разработке")}
                >
                  <Icon name="BarChart3" className="h-4 w-4 mr-2" />
                  Аналитика
                </Button>
              </div>

              {/* Кнопка выхода */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;