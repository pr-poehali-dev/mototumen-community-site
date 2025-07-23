import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface UsersStatsCardProps {
  totalUsers: number;
  activeUsers: number;
  totalRides: number;
  totalDistance: number;
  totalPurchases: number;
  avgLevel: number;
}

export const UsersStatsCard: React.FC<UsersStatsCardProps> = ({
  totalUsers,
  activeUsers,
  totalRides,
  totalDistance,
  totalPurchases,
  avgLevel,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="Users" className="h-4 w-4 mr-2" />
            Всего пользователей
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-white">{totalUsers}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="UserCheck" className="h-4 w-4 mr-2" />
            Активных
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-green-400">{activeUsers}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="Bike" className="h-4 w-4 mr-2" />
            Всего поездок
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-accent">{totalRides}</div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="Route" className="h-4 w-4 mr-2" />
            Общий километраж
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-blue-400">
            {totalDistance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="ShoppingBag" className="h-4 w-4 mr-2" />
            Всего покупок
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-yellow-400">
            {totalPurchases}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
            <Icon name="Award" className="h-4 w-4 mr-2" />
            Средний уровень
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-2xl font-bold text-purple-400">{avgLevel}</div>
        </CardContent>
      </Card>
    </div>
  );
};
