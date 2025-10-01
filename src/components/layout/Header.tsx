import React, { useState } from "react";
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
import AdminPanel from "@/components/AdminPanel";
import TelegramAuthSimple from "@/components/auth/TelegramAuthSimple";
import AuthDebug from "@/components/auth/AuthDebug";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [showTelegramAuth, setShowTelegramAuth] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
                  className="block px-4 py-2 text-gray-300 hover:bg-[#004488] hover:text-white transition-colors"
                >
                  Карта маршрутов
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
                  {user.photoUrl ? (
                    <img 
                      src={user.photoUrl} 
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full border-2 border-[#004488] object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', user.photoUrl);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-8 h-8 bg-[#004488] rounded-full flex items-center justify-center ${user.photoUrl ? 'hidden' : 'flex'}`}>
                    <span className="text-white text-sm font-bold">
                      {user.firstName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white truncate max-w-24">
                      {user.firstName}
                    </p>
                    {user.username && (
                      <p className="text-xs text-gray-400 truncate max-w-24">
                        @{user.username}
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

            {/* Admin Panel Button - Desktop */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-300 hover:text-[#004488] hover:bg-transparent active:bg-transparent focus:bg-transparent transition-colors"
                onClick={() => setIsAdminPanelOpen(true)}
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
                      {user.photoUrl ? (
                        <img 
                          src={user.photoUrl} 
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full border-2 border-[#004488]"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#004488] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.firstName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{user.firstName}</p>
                        {user.username && (
                          <p className="text-gray-400 text-sm">@{user.username}</p>
                        )}
                        <p className="text-xs text-blue-400">Перейти в профиль</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Panel - Mobile */}
                  <button
                    onClick={() => setIsAdminPanelOpen(true)}
                    className="block py-2 px-4 text-gray-300 hover:text-[#004488] hover:bg-dark-800 rounded flex items-center"
                  >
                    <Icon name="Shield" className="h-4 w-4 mr-2" />
                    Админ панель
                  </button>
                  
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

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
      
      {/* Telegram Auth Modal */}
      {showTelegramAuth && (
        <TelegramAuthSimple
          onAuth={() => {
            setShowTelegramAuth(false);
          }}
          onClose={() => setShowTelegramAuth(false)}
        />
      )}
      
      {/* Debug Panel */}
      {showDebug && <AuthDebug />}
    </header>
  );
};

export default Header;