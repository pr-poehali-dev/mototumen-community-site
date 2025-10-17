import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import UsersManagement from "@/components/admin/UsersManagement";

const Admin = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [stats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalProducts: 567,
    pendingProducts: 23,
    totalOrders: 89,
    pendingOrders: 12,
    totalEvents: 15,
    pendingEvents: 3,
  });

  const [pendingItems] = useState([
    {
      id: "1",
      type: "product",
      title: "Мотошлем AGV K1",
      author: "Иван Петров",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      type: "service",
      title: "Ремонт двигателя Honda",
      author: "СТО Мотор",
      date: "2024-01-14",
      status: "pending",
    },
    {
      id: "3",
      type: "event",
      title: "Мотослет 2024",
      author: "Организационный комитет",
      date: "2024-01-13",
      status: "pending",
    },
  ]);

  // Проверка прав доступа
  if (!user || (user.role !== "admin" && user.role !== "ceo")) {
    return <Navigate to="/" replace />;
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return "Package";
      case "service":
        return "Wrench";
      case "event":
        return "Calendar";
      default:
        return "FileText";
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "product":
        return "Товар";
      case "service":
        return "Услуга";
      case "event":
        return "Событие";
      default:
        return "Объявление";
    }
  };

  const handleApprove = (id: string) => {
    console.log("Approve item:", id);
  };

  const handleReject = (id: string) => {
    console.log("Reject item:", id);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            Панель администратора
          </h1>
          <Badge className="bg-red-500 text-white">Администратор</Badge>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
            <TabsTrigger value="moderation">Модерация</TabsTrigger>
            <TabsTrigger value="users">Пользователи</TabsTrigger>
            <TabsTrigger value="content">Контент</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Всего пользователей
                  </CardTitle>
                  <Icon
                    name="Users"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.activeUsers} активных
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Товары</CardTitle>
                  <Icon
                    name="Package"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalProducts}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingProducts} на модерации
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Заказы</CardTitle>
                  <Icon
                    name="ShoppingCart"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingOrders} в обработке
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">События</CardTitle>
                  <Icon
                    name="Calendar"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.pendingEvents} на модерации
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Последние действия</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Icon name="UserPlus" className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Новый пользователь</p>
                      <p className="text-xs text-muted-foreground">
                        Михаил Сидоров присоединился к сообществу
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      5 мин назад
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Icon name="Package" className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Новый товар</p>
                      <p className="text-xs text-muted-foreground">
                        Добавлен мотошлем на модерацию
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      15 мин назад
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Icon
                      name="MessageSquare"
                      className="h-4 w-4 text-orange-500"
                    />
                    <div>
                      <p className="text-sm font-medium">Новое сообщение</p>
                      <p className="text-xs text-muted-foreground">
                        Жалоба на объявление
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-auto">
                      1 час назад
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Элементы на модерации</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Проверьте и одобрите новые товары, услуги и события
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Тип</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Автор</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Icon
                              name={getTypeIcon(item.type)}
                              className="h-4 w-4"
                            />
                            <span>{getTypeText(item.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.author}</TableCell>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString("ru-RU")}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(item.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <Icon name="Check" className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Icon name="X" className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {activeSection === 'all-users' ? (
              <UsersManagement onBack={() => setActiveSection(null)} />
            ) : activeSection === 'roles' ? (
              <UsersManagement onBack={() => setActiveSection(null)} filterMode="with-roles" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveSection('all-users')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon name="Users" className="h-8 w-8 text-blue-500" />
                      <Badge variant="outline">Управление</Badge>
                    </div>
                    <CardTitle className="mt-4">Все пользователи</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Просмотр и управление всеми пользователями платформы, выдача прав администратора
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActiveSection('roles')}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon name="UserCheck" className="h-8 w-8 text-green-500" />
                      <Badge variant="outline">Роли</Badge>
                    </div>
                    <CardTitle className="mt-4">Роли и права</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Только администраторы, редакторы и модераторы. Управление детальными правами
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon name="Shield" className="h-8 w-8 text-red-500" />
                      <Badge variant="outline">Безопасность</Badge>
                    </div>
                    <CardTitle className="mt-4">Модерация</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Блокировка пользователей и управление жалобами
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="FileText" className="h-8 w-8 text-purple-500" />
                    <Badge variant="outline">Страницы</Badge>
                  </div>
                  <CardTitle className="mt-4">Страницы сайта</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Редактирование главной, о нас и других страниц
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Newspaper" className="h-8 w-8 text-orange-500" />
                    <Badge variant="outline">Новости</Badge>
                  </div>
                  <CardTitle className="mt-4">Новости</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Создание и редактирование новостей сообщества
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Image" className="h-8 w-8 text-pink-500" />
                    <Badge variant="outline">Медиа</Badge>
                  </div>
                  <CardTitle className="mt-4">Медиа файлы</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Управление изображениями и видео контентом
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Settings" className="h-8 w-8 text-gray-500" />
                    <Badge variant="outline">Общие</Badge>
                  </div>
                  <CardTitle className="mt-4">Общие настройки</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Название сайта, описание, контактная информация
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Palette" className="h-8 w-8 text-indigo-500" />
                    <Badge variant="outline">Внешний вид</Badge>
                  </div>
                  <CardTitle className="mt-4">Оформление</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Цвета, шрифты и стиль оформления сайта
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon name="Mail" className="h-8 w-8 text-teal-500" />
                    <Badge variant="outline">Уведомления</Badge>
                  </div>
                  <CardTitle className="mt-4">Email и SMS</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Настройка уведомлений и рассылок
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;