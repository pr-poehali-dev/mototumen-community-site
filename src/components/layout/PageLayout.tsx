import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { TelegramUser } from "@/hooks/useAuth";

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
}) => {
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

      <main>{children}</main>

      <Footer />
    </div>
  );
};

export default PageLayout;
