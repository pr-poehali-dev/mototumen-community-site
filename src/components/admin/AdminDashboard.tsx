import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface AdminDashboardProps {
  stats: any;
  recentActivity: any[];
}

const getRoleEmoji = (role: string): string => {
  const roleEmojis: Record<string, string> = {
    superadmin: " 👑",
    admin: " ⚡",
    moderator: " 🛡️",
    premium: " 💎",
    user: "",
  };
  return roleEmojis[role] || "";
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats, recentActivity }) => {
  return (
    <div className="space-y-6">
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
                      {activity.user_name}{getRoleEmoji(activity.user_role || 'user')} • {activity.location || 'Неизвестно'}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Нет активности</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};