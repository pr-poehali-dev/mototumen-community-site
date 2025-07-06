import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { TelegramUser, UserStats } from "@/types/user";

interface ProfileHeaderProps {
  user: TelegramUser;
  fullName: string;
  userInitials: string;
  userStats: UserStats;
  onClose: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  fullName,
  userInitials,
  userStats,
  onClose,
}) => {
  return (
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
          onClick={onClose}
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
              {user.username ? `@${user.username}` : "Участник сообщества"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Уровень</span>
                <Badge variant="outline" className="border-accent text-accent">
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
                  value={(userStats.experience / userStats.maxExperience) * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Icon name="TrendingUp" className="h-5 w-5 mr-2 text-accent" />
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
                  <span className="text-sm text-zinc-400">Километров</span>
                </div>
                <span className="text-white font-semibold">
                  {userStats.totalDistance.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" className="h-4 w-4 text-accent" />
                  <span className="text-sm text-zinc-400">Мероприятий</span>
                </div>
                <span className="text-white font-semibold">
                  {userStats.eventsAttended}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="ShoppingBag" className="h-4 w-4 text-accent" />
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
                  <div className="text-xs text-zinc-400">Превысил 200 км/ч</div>
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
                  <div className="text-xs text-zinc-400">Проехал 10,000 км</div>
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
    </div>
  );
};

export default ProfileHeader;
