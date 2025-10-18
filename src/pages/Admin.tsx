import React, { useState, useEffect } from "react";
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

const ADMIN_API = 'https://functions.poehali.dev/a4bf4de7-33a4-406c-95cc-0529c16d6677';

const Admin = () => {
  const { user, isAdmin, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin || !token) return;

    const fetchData = async () => {
      try {
        // Получаем статистику
        const statsRes = await fetch(`${ADMIN_API}?action=stats`, {
          headers: { 'X-Auth-Token': token }
        });
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setRecentActivity(statsData.recent_activity || []);

        // Получаем пользователей
        const usersRes = await fetch(`${ADMIN_API}?action=users`, {
          headers: { 'X-Auth-Token': token }
        });
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, token]);

  // Проверка прав доступа
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004488] mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
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

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(ADMIN_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({ user_id: userId, role: newRole })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
      } else {
        alert(data.error || 'Ошибка при изменении роли');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Не удалось изменить роль');
    }
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
                  <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.active_users || 0} активных
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Магазины</CardTitle>
                  <Icon
                    name="Store"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.total_shops || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Активных точек продаж
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Объявления</CardTitle>
                  <Icon
                    name="MessageSquare"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_announcements || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Всего в системе
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Школы</CardTitle>
                  <Icon
                    name="GraduationCap"
                    className="h-4 w-4 text-muted-foreground"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_schools || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Учебных заведений
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
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <Icon name="Activity" className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user_name} • {activity.location || 'Неизвестно'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Нет активности</p>
                  )}
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
            <Card>
              <CardHeader>
                <CardTitle>Пользователи системы</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Всего зарегистрировано: {users.length} пользователей
                </p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Роль</TableHead>
                      <TableHead>Дата регистрации</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {u.avatar_url && (
                              <img src={u.avatar_url} alt={u.name} className="w-8 h-8 rounded-full" />
                            )}
                            <div>
                              <p className="font-medium">{u.name}</p>
                              {u.username && (
                                <p className="text-xs text-muted-foreground">@{u.username}</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                            {u.role === 'admin' ? 'Админ' : u.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(u.created_at).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          {u.first_name !== 'Anton' && (
                            <div className="flex gap-2">
                              {u.role !== 'admin' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRoleChange(u.id, 'admin')}
                                >
                                  Админ
                                </Button>
                              )}
                              {u.role !== 'moderator' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRoleChange(u.id, 'moderator')}
                                >
                                  Модератор
                                </Button>
                              )}
                              {u.role !== 'user' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleRoleChange(u.id, 'user')}
                                >
                                  Пользователь
                                </Button>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Управление контентом</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Статистика по контенту платформы
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Store" className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold">{stats?.total_shops || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Магазины</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="MessageSquare" className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">{stats?.total_announcements || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Объявления</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="GraduationCap" className="h-5 w-5 text-purple-500" />
                      <span className="text-2xl font-bold">{stats?.total_schools || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Школы</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Icon name="Wrench" className="h-5 w-5 text-orange-500" />
                      <span className="text-2xl font-bold">{stats?.total_services || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Услуги</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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