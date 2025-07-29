import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAuth as useOldAuth } from "@/hooks/useAuth";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";
import PageLayout from "@/components/layout/PageLayout";
import HeroSection from "@/components/layout/HeroSection";
import StatsSection from "@/components/layout/StatsSection";
import MotorcycleHeroSection from "@/components/layout/MotorcycleHeroSection";
import BoardSection from "@/components/layout/BoardSection";

const Index: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const {
    isAdmin,
    showAdminLogin,
    showAdminPanel,
    handleAdminLogin,
    handleAdminLogout,
    setShowAdminLogin,
    setShowAdminPanel,
  } = useOldAuth();

  // Show admin login screen if requested
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Motorcycle Hero Section */}
      <MotorcycleHeroSection />

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