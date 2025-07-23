import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { TelegramUser, UserStats } from "@/types/user";
import { UsersStatsCard } from "./UsersStatsCard";

interface AdminUser extends TelegramUser {
  stats: UserStats;
  lastActivity: string;
  isActive: boolean;
  registrationDate: string;
}

interface UsersTabProps {
  users: AdminUser[];
  totalUsers: number;
  activeUsers: number;
  getUserStats: {
    totalRides: number;
    totalDistance: number;
    totalPurchases: number;
    avgLevel: number;
  };
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  totalUsers,
  activeUsers,
  getUserStats,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getUserInitials = (user: AdminUser) => {
    return `${user.first_name[0]}${user.last_name?.[0] || ""}`;
  };

  const getFullName = (user: AdminUser) => {
    return `${user.first_name} ${user.last_name || ""}`.trim();
  };

  return (
    <div className="space-y-6">
      <UsersStatsCard
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        totalRides={getUserStats.totalRides}
        totalDistance={getUserStats.totalDistance}
        totalPurchases={getUserStats.totalPurchases}
        avgLevel={getUserStats.avgLevel}
      />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Пользователи ({users.length})
          </h3>
          <p className="text-sm text-zinc-400">
            Управление пользователями и их данными
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Icon
              name="Search"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400"
            />
            <Input
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Список пользователей */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Список пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-accent/20 border-accent"
                      : "bg-zinc-900 border-zinc-700 hover:bg-zinc-700"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.photo_url}
                          alt={getFullName(user)}
                        />
                        <AvatarFallback className="bg-accent text-white text-sm">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-zinc-800 ${
                          user.isActive ? "bg-green-500" : "bg-zinc-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-white truncate">
                          {getFullName(user)}
                        </div>
                        <Badge
                          variant="outline"
                          className="border-accent text-accent"
                        >
                          {user.stats.level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-zinc-400">
                          {user.username ? `@${user.username}` : "Без username"}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {user.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Детали пользователя */}
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white">Детали пользователя</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                {/* Профиль */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedUser.photo_url}
                      alt={getFullName(selectedUser)}
                    />
                    <AvatarFallback className="bg-accent text-white text-lg">
                      {getUserInitials(selectedUser)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {getFullName(selectedUser)}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {selectedUser.username
                        ? `@${selectedUser.username}`
                        : "Без username"}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedUser.isActive ? "bg-green-500" : "bg-zinc-500"
                        }`}
                      />
                      <span className="text-xs text-zinc-400">
                        {selectedUser.isActive ? "Онлайн" : "Оффлайн"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400">Уровень</div>
                    <div className="text-lg font-semibold text-white">
                      {selectedUser.stats.level}
                    </div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400">Поездки</div>
                    <div className="text-lg font-semibold text-white">
                      {selectedUser.stats.ridesCount}
                    </div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400">Километры</div>
                    <div className="text-lg font-semibold text-white">
                      {selectedUser.stats.totalDistance.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-zinc-900 p-3 rounded-lg">
                    <div className="text-xs text-zinc-400">Покупки</div>
                    <div className="text-lg font-semibold text-white">
                      {selectedUser.stats.purchasesCount}
                    </div>
                  </div>
                </div>

                {/* Прогресс */}
                <div className="bg-zinc-900 p-3 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-zinc-400">Опыт</span>
                    <span className="text-white">
                      {selectedUser.stats.experience}/
                      {selectedUser.stats.maxExperience}
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedUser.stats.experience /
                        selectedUser.stats.maxExperience) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                {/* Информация */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">ID:</span>
                    <span className="text-sm text-white">
                      {selectedUser.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Регистрация:</span>
                    <span className="text-sm text-white">
                      {selectedUser.registrationDate}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">
                      Последняя активность:
                    </span>
                    <span className="text-sm text-white">
                      {selectedUser.lastActivity}
                    </span>
                  </div>
                </div>

                {/* Действия */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-white"
                  >
                    <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                    Написать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-white"
                  >
                    <Icon name="Ban" className="h-4 w-4 mr-2" />
                    Заблокировать
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon
                  name="Users"
                  className="h-12 w-12 text-zinc-600 mx-auto mb-4"
                />
                <p className="text-zinc-400">
                  Выберите пользователя для просмотра деталей
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
