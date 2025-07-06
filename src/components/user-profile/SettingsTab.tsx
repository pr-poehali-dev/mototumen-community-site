import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsTab: React.FC = () => {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Настройки профиля</CardTitle>
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
            <Button variant="outline" size="sm" className="border-zinc-700">
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
            <Button variant="outline" size="sm" className="border-zinc-700">
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
            <Button variant="outline" size="sm" className="border-zinc-700">
              Включено
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
