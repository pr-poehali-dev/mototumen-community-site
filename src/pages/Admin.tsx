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

const Admin = () => {
  const { user } = useAuth();
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
  if (!user || user.role !== "admin") {
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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление пользователями</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon
                    name="Users"
                    className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    Управление пользователями
                  </h3>
                  <p className="text-muted-foreground">
                    Здесь будет список всех пользователей с возможностью
                    управления
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Управление контентом</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon
                    name="FileText"
                    className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-semibold mb-2">
                    Управление контентом
                  </h3>
                  <p className="text-muted-foreground">
                    Редактирование страниц, новостей и других материалов
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки системы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Icon
                    name="Settings"
                    className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                  />
                  <h3 className="text-lg font-semibold mb-2">Настройки</h3>
                  <p className="text-muted-foreground">
                    Общие настройки сайта и системы
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
