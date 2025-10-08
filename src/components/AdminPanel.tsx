import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
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

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Управление пользователями</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800 border-zinc-700 hover:border-blue-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Users" className="h-8 w-8 text-blue-500" />
                        <Badge variant="outline" className="border-blue-500 text-blue-400">Управление</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Все пользователи</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Просмотр и управление всеми пользователями платформы
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-green-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="UserCheck" className="h-8 w-8 text-green-500" />
                        <Badge variant="outline" className="border-green-500 text-green-400">Роли</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Роли и права</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Управление ролями и правами доступа пользователей
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-red-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Shield" className="h-8 w-8 text-red-500" />
                        <Badge variant="outline" className="border-red-500 text-red-400">Безопасность</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Модерация</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Блокировка пользователей и управление жалобами
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Управление контентом</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800 border-zinc-700 hover:border-purple-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Store" className="h-8 w-8 text-purple-500" />
                        <Badge variant="outline" className="border-purple-500 text-purple-400">Магазины</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Магазины</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Управление магазинами и товарами
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-orange-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="GraduationCap" className="h-8 w-8 text-orange-500" />
                        <Badge variant="outline" className="border-orange-500 text-orange-400">Школы</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Мотошколы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Создание и редактирование мотошкол
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-yellow-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Wrench" className="h-8 w-8 text-yellow-500" />
                        <Badge variant="outline" className="border-yellow-500 text-yellow-400">Сервисы</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Сервисы</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Управление сервисными центрами
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Настройки</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-zinc-800 border-zinc-700 hover:border-gray-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Settings" className="h-8 w-8 text-gray-400" />
                        <Badge variant="outline" className="border-gray-500 text-gray-400">Общие</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Общие настройки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Название сайта, описание, контактная информация
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-indigo-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Megaphone" className="h-8 w-8 text-indigo-500" />
                        <Badge variant="outline" className="border-indigo-500 text-indigo-400">Объявления</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Объявления</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Управление объявлениями и модерация
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-zinc-800 border-zinc-700 hover:border-teal-500 transition-colors cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Icon name="Mail" className="h-8 w-8 text-teal-500" />
                        <Badge variant="outline" className="border-teal-500 text-teal-400">Уведомления</Badge>
                      </div>
                      <CardTitle className="mt-4 text-white">Email и SMS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-zinc-400">
                        Настройка уведомлений и рассылок
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;