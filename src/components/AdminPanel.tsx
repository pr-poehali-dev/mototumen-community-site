import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { UsersTab } from "./admin/tabs/UsersTab";
import { ShopsTab } from "./admin/tabs/ShopsTab";
import { SchoolsAdminTab } from "./admin/tabs/SchoolsAdminTab";
import { ServicesAdminTab } from "./admin/tabs/ServicesAdminTab";
import { AnnouncementsAdminTab } from "./admin/tabs/AnnouncementsAdminTab";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("users");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-2xl font-bold text-white flex items-center"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  <Icon name="Shield" className="h-6 w-6 mr-2 text-accent" />
                  Панель администратора
                </h2>
                <p className="text-zinc-400">Управление содержимым сайта</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-zinc-800"
              >
                <Icon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 bg-zinc-800 border-zinc-700">
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Users" className="h-4 w-4 mr-2" />
                  Пользователи
                </TabsTrigger>
                <TabsTrigger
                  value="shops"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Store" className="h-4 w-4 mr-2" />
                  Магазины
                </TabsTrigger>
                <TabsTrigger
                  value="schools"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
                  Школы
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Wrench" className="h-4 w-4 mr-2" />
                  Сервисы
                </TabsTrigger>
                <TabsTrigger
                  value="announcements"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Megaphone" className="h-4 w-4 mr-2" />
                  Объявления
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users">
                <UsersTab />
              </TabsContent>

              <TabsContent value="shops">
                <ShopsTab />
              </TabsContent>

              <TabsContent value="schools">
                <SchoolsAdminTab />
              </TabsContent>

              <TabsContent value="services">
                <ServicesAdminTab />
              </TabsContent>

              <TabsContent value="announcements">
                <AnnouncementsAdminTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;