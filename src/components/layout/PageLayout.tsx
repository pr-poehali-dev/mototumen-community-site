import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import BackButton from "@/components/ui/BackButton";
import { TelegramUser } from "@/hooks/useAuth";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
  user: TelegramUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onAuth: (userData: TelegramUser) => void;
  onLogout: () => void;
  onShowAdminLogin: () => void;
  onShowAdminPanel: () => void;
  className?: string;
  showBackButton?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  user,
  isAuthenticated,
  isAdmin,
  onAuth,
  onLogout,
  onShowAdminLogin,
  onShowAdminPanel,
  className = "min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white",
  showBackButton = true,
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  return (
    <div className={className}>
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onAuth={onAuth}
        onLogout={onLogout}
        onShowAdminLogin={onShowAdminLogin}
        onShowAdminPanel={onShowAdminPanel}
      />

      <main>
        {showBackButton && !isHomePage && (
          <div className="container mx-auto px-4 pt-6">
            <BackButton
              onClick={() => {
                if (onLogout && !isAuthenticated) {
                  onLogout();
                }
                window.location.href = "/";
              }}
            />
          </div>
        )}
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default PageLayout;
