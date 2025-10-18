import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface AdminContentProps {
  stats: any;
}

export const AdminContent: React.FC<AdminContentProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
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
    </div>
  );
};
