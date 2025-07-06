import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

interface UserProfileProps {
  user: TelegramUser;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitials = `${user.first_name[0]}${user.last_name?.[0] || ""}`;
  const fullName = `${user.first_name} ${user.last_name || ""}`.trim();

  const userStats = {
    level: 15,
    experience: 2350,
    maxExperience: 3000,
    ridesCount: 47,
    totalDistance: 12580,
    eventsAttended: 23,
    purchasesCount: 8,
  };

  const recentActivities = [
    {
      type: "ride",
      title: "Поездка в Абалак",
      date: "2 дня назад",
      icon: "Bike",
    },
    {
      type: "purchase",
      title: "Купил мотоперчатки",
      date: "5 дней назад",
      icon: "ShoppingBag",
    },
    {
      type: "event",
      title: "Участвовал в встрече клуба",
      date: "1 неделю назад",
      icon: "Users",
    },
    {
      type: "service",
      title: "Записался на ТО",
      date: "2 недели назад",
      icon: "Wrench",
    },
  ];

  const userOrders = [
    {
      id: "#MT-2024-001",
      item: "Шлем Shoei GT-Air II",
      status: "Доставлен",
      price: "₽35,000",
      date: "15.01.2024",
    },
    {
      id: "#MT-2024-002",
      item: "Мотоперчатки Alpinestars",
      status: "В пути",
      price: "₽8,500",
      date: "20.01.2024",
    },
    {
      id: "#MT-2024-003",
      item: "Техобслуживание",
      status: "Выполнено",
      price: "₽2,500",
      date: "10.01.2024",
    },
  ];

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-2 hover:bg-zinc-800">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photo_url} alt={fullName} />
              <AvatarFallback className="bg-accent text-white text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-white">{fullName}</div>
              <div className="text-xs text-zinc-400">
                {user.username ? `@${user.username}` : "Байкер"}
              </div>
            </div>
            <Icon name="ChevronDown" className="h-4 w-4 text-zinc-400" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-zinc-900 border-zinc-700"
      >
        <DropdownMenuItem
          onClick={() => setIsProfileOpen(true)}
          className="cursor-pointer"
        >
          <Icon name="User" className="h-4 w-4 mr-2" />
          Личный кабинет
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Icon name="Settings" className="h-4 w-4 mr-2" />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Icon name="Bell" className="h-4 w-4 mr-2" />
          Уведомления
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer text-red-400"
        >
          <Icon name="LogOut" className="h-4 w-4 mr-2" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const ProfileModal = () => (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 ${isProfileOpen ? "block" : "hidden"}`}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Личный кабинет
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsProfileOpen(false)}
                className="hover:bg-zinc-800"
              >
                <Icon name="X" className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.photo_url} alt={fullName} />
                    <AvatarFallback className="bg-accent text-white text-2xl">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle
                    className="text-white"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {fullName}
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    {user.username
                      ? `@${user.username}`
                      : "Участник сообщества"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Уровень</span>
                      <Badge
                        variant="outline"
                        className="border-accent text-accent"
                      >
                        {userStats.level}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Опыт</span>
                        <span className="text-white">
                          {userStats.experience}/{userStats.maxExperience}
                        </span>
                      </div>
                      <Progress
                        value={
                          (userStats.experience / userStats.maxExperience) * 100
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Icon
                      name="TrendingUp"
                      className="h-5 w-5 mr-2 text-accent"
                    />
                    Статистика
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Bike" className="h-4 w-4 text-accent" />
                        <span className="text-sm text-zinc-400">Поездки</span>
                      </div>
                      <span className="text-white font-semibold">
                        {userStats.ridesCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Route" className="h-4 w-4 text-accent" />
                        <span className="text-sm text-zinc-400">
                          Километров
                        </span>
                      </div>
                      <span className="text-white font-semibold">
                        {userStats.totalDistance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon name="Calendar" className="h-4 w-4 text-accent" />
                        <span className="text-sm text-zinc-400">
                          Мероприятий
                        </span>
                      </div>
                      <span className="text-white font-semibold">
                        {userStats.eventsAttended}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon
                          name="ShoppingBag"
                          className="h-4 w-4 text-accent"
                        />
                        <span className="text-sm text-zinc-400">Покупок</span>
                      </div>
                      <span className="text-white font-semibold">
                        {userStats.purchasesCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Icon name="Award" className="h-5 w-5 mr-2 text-accent" />
                    Достижения
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Icon name="Zap" className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          Скоростной
                        </div>
                        <div className="text-xs text-zinc-400">
                          Превысил 200 км/ч
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Icon name="Mountain" className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          Путешественник
                        </div>
                        <div className="text-xs text-zinc-400">
                          Проехал 10,000 км
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Icon name="Users" className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          Социальный
                        </div>
                        <div className="text-xs text-zinc-400">
                          Участвовал в 20 событиях
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-zinc-800 border-zinc-700">
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
                  value="settings"
                  className="data-[state=active]:bg-accent data-[state=active]:text-white"
                >
                  Настройки
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Последняя активность
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                            <Icon
                              name={activity.icon as any}
                              className="h-5 w-5 text-accent"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                              {activity.title}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {activity.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      История заказов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userOrders.map((order, index) => (
                        <div
                          key={index}
                          className="border border-zinc-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-accent font-medium">
                              {order.id}
                            </span>
                            <Badge
                              variant={
                                order.status === "Доставлен"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                order.status === "Доставлен"
                                  ? "bg-green-600"
                                  : "bg-blue-600"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="text-white font-medium mb-1">
                            {order.item}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">{order.date}</span>
                            <span className="text-accent font-semibold">
                              {order.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                <Card className="bg-zinc-800 border-zinc-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Настройки профиля
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">
                            Уведомления о новых поездках
                          </div>
                          <div className="text-xs text-zinc-400">
                            Получать уведомления о мероприятиях
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700"
                        >
                          Включено
                        </Button>
                      </div>
                      <Separator className="bg-zinc-700" />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">
                            Приватность профиля
                          </div>
                          <div className="text-xs text-zinc-400">
                            Показывать статистику другим пользователям
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700"
                        >
                          Публичный
                        </Button>
                      </div>
                      <Separator className="bg-zinc-700" />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-white">
                            Рассылка новостей
                          </div>
                          <div className="text-xs text-zinc-400">
                            Получать новости сообщества
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700"
                        >
                          Включено
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ProfileDropdown />
      <ProfileModal />
    </>
  );
};

export default UserProfile;
