import React from "react";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import StatsSection from "@/components/layout/StatsSection";
import BoardSection from "@/components/layout/BoardSection";

const Index: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    showAdminLogin,
    showAdminPanel,
    handleAuth,
    handleLogout,
    handleAdminLogin,
    handleAdminLogout,
    setShowAdminLogin,
    setShowAdminPanel,
  } = useAuth();

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
