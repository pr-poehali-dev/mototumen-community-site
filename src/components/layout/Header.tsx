import React from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import TelegramAuth from "@/components/TelegramAuth";
import UserProfile from "@/components/UserProfile";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

interface HeaderProps {
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAuth: (userData: TelegramUser) => void;
  onLogout: () => void;
  onShowAdminLogin: () => void;
  onShowAdminPanel: () => void;
}

const navigationItems = [
  { href: "#shop", label: "Магазин" },
  { href: "#service", label: "Сервис" },
  { href: "#schools", label: "Мотошколы" },
  { href: "#events", label: "События" },
];

const usefulMenuItems = [
  { href: "#ads", label: "Объявления" },
  { href: "#lost-found", label: "Потеряшки/Находки" },
  { href: "#upcoming-events", label: "Ближайшие события" },
  { href: "#help", label: "Помощь" },
  { href: "#map", label: "Карта маршрутов" },
];

const Header: React.FC<HeaderProps> = ({
  user,
  isAuthenticated,
  isAdmin,
  onAuth,
  onLogout,
  onShowAdminLogin,
  onShowAdminPanel,
}) => {
  return (
    <header className="bg-black/50 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Icon name="Zap" className="h-8 w-8 text-accent" />
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                МОТОТюмень
              </h1>
              <p className="text-sm text-zinc-400">Городское мотосообщество</p>
            </div>
          </div>

          {/* Navigation */}
          <nav
            className="hidden md:flex space-x-6"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Dropdown Menu */}
            <div className="relative group">
              <a
                href="#useful"
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Полезное
                <Icon name="ChevronDown" className="h-4 w-4 inline ml-1" />
              </a>
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-md shadow-lg z-50 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {usefulMenuItems.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 hover:bg-accent/10 transition-colors ${
                      index < usefulMenuItems.length - 1
                        ? "border-b border-border"
                        : ""
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <UserProfile user={user} onLogout={onLogout} />
            ) : (
              <TelegramAuth onAuth={onAuth} isAuthenticated={isAuthenticated} />
            )}

            <Button
              size="sm"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              onClick={onShowAdminLogin}
            >
              <Icon name="Settings" className="h-4 w-4" />
            </Button>

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="border-accent text-accent"
                onClick={onShowAdminPanel}
              >
                <Icon name="Shield" className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
