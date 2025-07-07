import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { AdminPanelProps } from "./admin/types";
import { useProducts } from "./admin/hooks/useProducts";
import { useServices } from "./admin/hooks/useServices";
import { useCourses } from "./admin/hooks/useCourses";
import { useAdvertisements } from "./admin/hooks/useAdvertisements";
import { useUsers } from "./admin/hooks/useUsers";
import { ProductsTab } from "./admin/tabs/ProductsTab";
import { ServicesTab } from "./admin/tabs/ServicesTab";
import { CoursesTab } from "./admin/tabs/CoursesTab";
import { AdvertisementsTab } from "./admin/tabs/AdvertisementsTab";
import { UsersTab } from "./admin/tabs/UsersTab";

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("products");

  const { products, saveProduct, deleteProduct } = useProducts();
  const { services, saveService, deleteService } = useServices();
  const { courses, saveCourse, deleteCourse } = useCourses();
  const { advertisements, saveAdvertisement, deleteAdvertisement } =
    useAdvertisements();
  const { users, totalUsers, totalActiveUsers, getUserStats } = useUsers();

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
                  value="products"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
                  Товары
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Wrench" className="h-4 w-4 mr-2" />
                  Услуги
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="GraduationCap" className="h-4 w-4 mr-2" />
                  Курсы
                </TabsTrigger>
                <TabsTrigger
                  value="ads"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Megaphone" className="h-4 w-4 mr-2" />
                  Объявления
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  <Icon name="Users" className="h-4 w-4 mr-2" />
                  Пользователи
                </TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <ProductsTab
                  products={products}
                  onSave={saveProduct}
                  onDelete={deleteProduct}
                />
              </TabsContent>

              <TabsContent value="services">
                <ServicesTab
                  services={services}
                  onSave={saveService}
                  onDelete={deleteService}
                />
              </TabsContent>

              <TabsContent value="courses">
                <CoursesTab courses={courses} onDelete={deleteCourse} />
              </TabsContent>

              <TabsContent value="ads">
                <AdvertisementsTab
                  advertisements={advertisements}
                  onDelete={deleteAdvertisement}
                />
              </TabsContent>

              <TabsContent value="users">
                <UsersTab
                  users={users}
                  totalUsers={totalUsers}
                  activeUsers={totalActiveUsers}
                  getUserStats={getUserStats}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
