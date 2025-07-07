import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "./ProfileHeader";
import ActivityTab from "./ActivityTab";
import OrdersTab from "./OrdersTab";
import SettingsTab from "./SettingsTab";
import { GarageTab } from "./GarageTab";
import { TelegramUser, UserStats, UserActivity, UserOrder } from "@/types/user";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TelegramUser;
  fullName: string;
  userInitials: string;
  userStats: UserStats;
  activities: UserActivity[];
  orders: UserOrder[];
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  fullName,
  userInitials,
  userStats,
  activities,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <ProfileHeader
            user={user}
            fullName={fullName}
            userInitials={userInitials}
            userStats={userStats}
            onClose={onClose}
          />

          <div className="px-6 pb-6">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-zinc-800 border-zinc-700">
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  Активность
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  Заказы
                </TabsTrigger>
                <TabsTrigger
                  value="garage"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  Гараж
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  Настройки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-6">
                <ActivityTab activities={activities} />
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <OrdersTab orders={orders} />
              </TabsContent>

              <TabsContent value="garage" className="mt-6">
                <GarageTab
                  vehicles={[]}
                  onAddVehicle={(vehicle) =>
                    console.log("Add vehicle:", vehicle)
                  }
                  onUpdateVehicle={(id, vehicle) =>
                    console.log("Update vehicle:", id, vehicle)
                  }
                  onDeleteVehicle={(id) => console.log("Delete vehicle:", id)}
                />
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
