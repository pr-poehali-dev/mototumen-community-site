import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { TelegramUser } from "@/hooks/useAuth";

interface HeaderProps {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAuth: (userData: TelegramUser) => void;
  onLogout: () => void;
  onShowAdminLogin: () => void;
  onShowAdminPanel: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  isAuthenticated,
  isAdmin,
  onAuth,
  onLogout,
  onShowAdminLogin,
  onShowAdminPanel,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#004488] rounded-full flex items-center justify-center">
              <Icon name="Zap" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-['Oswald']">
              МОТО<span className="text-[#004488]">ТЮМЕНЬ</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-300 hover:text-[#004488] transition-colors"
            >
              Главная
            </a>
            <a
              href="/shop"
              className="text-gray-300 hover:text-[#004488] transition-colors"
            >
              Магазин
            </a>
            <a
              href="/service"
              className="text-gray-300 hover:text-[#004488] transition-colors"
            >
              Сервис
            </a>
            <a
              href="/schools"
              className="text-gray-300 hover:text-[#004488] transition-colors"
            >
              Мотошколы
            </a>

            <a
              href="/events"
              className="text-gray-300 hover:text-[#004488] transition-colors"
            >
              События
            </a>

            {/* Dropdown Menu for "Полезное" */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-[#004488] transition-colors flex items-center">
                Полезное
                <Icon name="ChevronDown" className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 bg-dark-800 border border-dark-600 rounded-md shadow-lg z-50 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="/ads"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors border-b border-dark-600"
                >
                  Объявления
                </a>
                <a
                  href="/lost-found"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors border-b border-dark-600"
                >
                  Потеряшки/Находки
                </a>
                <a
                  href="/upcoming-events"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors border-b border-dark-600"
                >
                  Ближайшие события
                </a>
                <a
                  href="/help"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors border-b border-dark-600"
                >
                  Помощь
                </a>
                <a
                  href="/map"
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors"
                >
                  Карта маршрутов
                </a>
              </div>
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowAdminPanel}
                    className="border-[#004488] text-[#004488] hover:bg-[#004488] hover:text-white"
                  >
                    <Icon name="Settings" className="h-4 w-4 mr-2" />
                    Админ
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onShowAdminLogin}
                  className="border-[#004488] text-[#004488] hover:bg-[#004488] hover:text-white"
                >
                  <Icon name="Shield" className="h-4 w-4 mr-2" />
                  Настройки
                </Button>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#004488] rounded-full flex items-center justify-center">
                    <Icon name="User" className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white text-sm">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-gray-300 hover:text-white"
                >
                  <Icon name="LogOut" className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={onAuth}
                className="bg-[#004488] hover:bg-[#003366] text-white"
              >
                <Icon name="Send" className="h-4 w-4 mr-2" />
                Войти через Telegram
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Icon name="Menu" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-dark-700">
            <div className="space-y-2">
              <a
                href="/"
                className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded"
              >
                Главная
              </a>
              <a
                href="/shop"
                className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded"
              >
                Магазин
              </a>
              <a
                href="/service"
                className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded"
              >
                Сервис
              </a>
              <a
                href="/schools"
                className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded"
              >
                Мотошколы
              </a>

              <a
                href="/events"
                className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded"
              >
                События
              </a>

              {/* Mobile version of "Полезное" menu */}
              <div className="space-y-1">
                <div className="py-2 px-4 text-gray-300 font-semibold">
                  Полезное
                </div>
                <a
                  href="/ads"
                  className="block py-2 px-6 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded text-sm"
                >
                  Объявления
                </a>
                <a
                  href="/lost-found"
                  className="block py-2 px-6 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded text-sm"
                >
                  Потеряшки/Находки
                </a>
                <a
                  href="/upcoming-events"
                  className="block py-2 px-6 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded text-sm"
                >
                  Ближайшие события
                </a>
                <a
                  href="/help"
                  className="block py-2 px-6 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded text-sm"
                >
                  Помощь
                </a>
                <a
                  href="/map"
                  className="block py-2 px-6 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded text-sm"
                >
                  Карта маршрутов
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
