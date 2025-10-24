import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { UserProfile, useAuth } from "@/contexts/AuthContext";
import TelegramAuthSimple from "@/components/auth/TelegramAuthSimple";
import { getRoleEmoji } from "@/components/admin/RoleBadge";

interface HeaderProps {}

const ADMIN_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTelegramAuth, setShowTelegramAuth] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [hasOrganization, setHasOrganization] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout, token } = useAuth();
  
  useEffect(() => {
    const checkOrganization = async () => {
      if (!token || !user) return;
      try {
        const response = await fetch(`${ADMIN_API}?action=organization-requests`, {
          headers: { 'X-Auth-Token': token }
        });
        if (response.ok) {
          const data = await response.json();
          const userOrg = (data.requests || []).find((r: any) => r.user_id === user.id && r.status === 'approved');
          setHasOrganization(!!userOrg);
        }
      } catch (error) {
        console.error('Failed to check organization:', error);
      }
    };
    checkOrganization();
  }, [token, user]);

  const getDefaultAvatar = (gender?: string) => {
    return gender === 'female' 
      ? '/img/323010ec-ee00-4bf5-b69e-88189dbc69e9.jpg'
      : '/img/5732fd0a-94d2-4175-8e07-8d3c8aed2373.jpg';
  };

  return (
    <header className="bg-dark-900 border-b border-dark-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowDebug(!showDebug)}
            title="Кликните для отладки"
          >
            <img
              src="https://cdn.poehali.dev/files/972cbcb6-2462-43d5-8df9-3cc8a591f756.png"
              alt="МотоТюмень"
              className="w-12 h-12 rounded-full object-cover"
            />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-['Oswald']">
              МОТО<span className="text-[#004488]">ТЮМЕНЬ</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
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
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors border-b border-dark-600"
                >
                  Карта маршрутов
                </a>
                <a
                  href="/become-organization"
                  className="block px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all"
                >
                  ✨ Стать организацией
                </a>
              </div>
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Profile or Login */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* User Avatar */}
                <div 
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => navigate('/profile')}
                >
                  <img 
                    src={user.avatar_url || getDefaultAvatar(user.gender)} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-[#004488] object-cover"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white truncate max-w-24 flex items-center">
                      {user.name}{getRoleEmoji(user.role || 'user')}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-400 truncate max-w-24">
                        {user.email.split('@')[0]}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                  title="Выйти"
                >
                  <Icon name="LogOut" className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowTelegramAuth(true)}
                className="bg-[#0088cc] hover:bg-[#0077bb] text-white font-medium transition-all"
                size="sm"
              >
                <Icon name="Send" className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Войти</span>
              </Button>
            )}

            {/* Organization Panel Button */}
            {isAuthenticated && hasOrganization && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-300 hover:text-[#004488] hover:bg-transparent active:bg-transparent focus:bg-transparent transition-colors"
                onClick={() => navigate('/organization')}
              >
                <Icon name="Building2" className="h-4 w-4 mr-2" />
                Организация
              </Button>
            )}

            {/* Admin Panel Button - Desktop - только для админов */}
            {isAuthenticated && isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-300 hover:text-[#004488] hover:bg-transparent active:bg-transparent focus:bg-transparent transition-colors"
                onClick={() => navigate('/admin')}
              >
                <Icon name="Shield" className="h-4 w-4 mr-2" />
                Админ
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
          <nav className="md:hidden py-3 sm:py-4 border-t border-dark-700">
            <div className="space-y-1 sm:space-y-2">
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
                <a
                  href="/become-organization"
                  className="block py-2 px-6 bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-semibold hover:from-yellow-500 hover:to-yellow-400 rounded text-sm transition-all"
                >
                  ✨ Стать организацией
                </a>
              </div>

              {/* Auth/Profile - Mobile */}
              {isAuthenticated && user ? (
                <>
                  <div 
                    className="py-2 px-4 border-t border-dark-700 cursor-pointer hover:bg-dark-800 transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar_url || getDefaultAvatar(user.gender)} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full border-2 border-[#004488] object-cover"
                      />
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        {user.email && (
                          <p className="text-gray-400 text-sm">{user.email.split('@')[0]}</p>
                        )}
                        <p className="text-xs text-blue-400">Перейти в профиль</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Panel - Mobile - только для админов */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/admin');
                      }}
                      className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded flex items-center"
                    >
                      <Icon name="Shield" className="h-4 w-4 mr-2" />
                      Админ панель
                    </button>
                  )}
                  
                  {/* Logout - Mobile */}
                  <button
                    onClick={logout}
                    className="block py-2 px-4 text-gray-300 hover:text-red-400 hover:bg-dark-800 rounded flex items-center"
                  >
                    <Icon name="LogOut" className="h-4 w-4 mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowTelegramAuth(true)}
                  className="block py-2 px-4 text-white bg-[#0088cc] hover:bg-[#0077bb] rounded flex items-center transition-colors"
                >
                  <Icon name="Send" className="h-4 w-4 mr-2" />
                  Войти через Telegram
                </button>
              )}
            </div>
          </nav>
        )}
      </div>

      {/* Telegram Auth Modal */}
      {showTelegramAuth && (
        <TelegramAuthSimple
          onAuth={() => {
            setShowTelegramAuth(false);
          }}
          onClose={() => setShowTelegramAuth(false)}
        />
      )}
    </header>
  );
};

export default Header;
export { Header };