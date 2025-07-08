import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import StatsSection from "@/components/layout/StatsSection";
import BoardSection from "@/components/layout/BoardSection";

const Index: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAuth = () => {
    // Мок данные для тестирования
    const mockTelegramUser = {
      id: 123456789,
      first_name: "Алексей",
      last_name: "Иванов",
      username: "alexmoto",
      photo_url: "/api/placeholder/150/150",
      auth_date: Date.now(),
      hash: "mock_hash",
    };
    login(mockTelegramUser);
  };

  const handleLogout = () => {
    logout();
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  const handleAdminLogin = (adminStatus: boolean) => {
    setIsAdmin(adminStatus);
    setShowAdminLogin(false);
    if (adminStatus) {
      setShowAdminPanel(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminPanel(false);
  };

  // Show admin login screen if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <PageLayout
      user={user}
      isAuthenticated={isAuthenticated}
      isAdmin={isAdmin}
      onAuth={handleAuth}
      onLogout={handleLogout}
      onShowAdminLogin={() => setShowAdminLogin(true)}
      onShowAdminPanel={() => setShowAdminPanel(true)}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Board Section */}
      <BoardSection />

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel
          isOpen={showAdminPanel}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </PageLayout>
  );
};

export default Index;
