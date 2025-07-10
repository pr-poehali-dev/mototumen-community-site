import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ProfileInfo from "@/components/profile/ProfileInfo";
import OrdersSection from "@/components/profile/OrdersSection";
import SettingsSection from "@/components/profile/SettingsSection";
import GarageSection from "@/components/profile/GarageSection";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, handleLogout } = useAuth();
  const {
    user,
    orders,
    vehicles,
    mainVehicleId,
    handleUserUpdate,
    handlePreferenceChange,
    handleVehicleUpdate,
    handleMainVehicleChange,
  } = useProfile();

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Если не авторизован, показываем загрузку
  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  // Функция выхода с редиректом
  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Личный кабинет
              </h1>
              <p className="text-sm sm:text-base text-zinc-400">
                Управляйте своим профилем и заказами
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleLogoutClick}
            >
              <Icon name="LogOut" className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-zinc-900 mb-6 sm:mb-8">
              <TabsTrigger value="profile" className="text-xs sm:text-sm">
                <Icon name="User" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm">
                <Icon name="ShoppingBag" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Icon name="Settings" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Настройки</span>
              </TabsTrigger>
              <TabsTrigger value="garage" className="text-xs sm:text-sm">
                <Icon name="Car" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Гараж</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <ProfileInfo user={user} onUserUpdate={handleUserUpdate} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4 sm:space-y-6">
              <OrdersSection orders={orders} />
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <SettingsSection
                user={user}
                onPreferenceChange={handlePreferenceChange}
              />
            </TabsContent>

            <TabsContent value="garage" className="space-y-4 sm:space-y-6">
              <GarageSection
                vehicles={vehicles}
                mainVehicleId={mainVehicleId}
                onVehicleUpdate={handleVehicleUpdate}
                onMainVehicleChange={handleMainVehicleChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
