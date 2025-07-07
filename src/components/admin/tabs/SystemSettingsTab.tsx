import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface SystemSettings {
  maintenance: {
    enabled: boolean;
    message: string;
  };
  features: {
    registration: boolean;
    shop: boolean;
    events: boolean;
    classifieds: boolean;
    chat: boolean;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    twoFactorRequired: boolean;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
}

export const SystemSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    maintenance: {
      enabled: false,
      message: "Сайт находится на техническом обслуживании. Скоро вернемся!",
    },
    features: {
      registration: true,
      shop: true,
      events: true,
      classifieds: true,
      chat: false,
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 3600,
      twoFactorRequired: false,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    console.log("Сохранение системных настроек:", settings);
  };

  const handleFeatureToggle = (feature: keyof SystemSettings["features"]) => {
    setSettings((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleNotificationToggle = (
    type: keyof SystemSettings["notifications"],
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Системные настройки
          </h3>
          <p className="text-sm text-zinc-400">
            Управление функциями и безопасностью системы
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Icon name="Edit" className="h-4 w-4 mr-2" />
            {isEditing ? "Отмена" : "Редактировать"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave}>
              <Icon name="Save" className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          )}
        </div>
      </div>

      {/* Режим обслуживания */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Icon name="Wrench" className="h-5 w-5 mr-2" />
            Режим обслуживания
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">
                Включить режим обслуживания
              </Label>
              <p className="text-sm text-zinc-400">
                Закрыть сайт для пользователей на время обновлений
              </p>
            </div>
            <Switch
              checked={settings.maintenance.enabled}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  maintenance: { ...prev.maintenance, enabled: checked },
                }))
              }
              disabled={!isEditing}
            />
          </div>
          {settings.maintenance.enabled && (
            <div>
              <Label className="text-zinc-300">Сообщение пользователям</Label>
              <Input
                value={settings.maintenance.message}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    maintenance: {
                      ...prev.maintenance,
                      message: e.target.value,
                    },
                  }))
                }
                disabled={!isEditing}
                className="bg-zinc-900 border-zinc-600"
                placeholder="Введите сообщение..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Функции сайта */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Icon name="Settings" className="h-5 w-5 mr-2" />
            Функции сайта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Регистрация</Label>
                <p className="text-sm text-zinc-400">
                  Разрешить новые регистрации
                </p>
              </div>
              <Switch
                checked={settings.features.registration}
                onCheckedChange={() => handleFeatureToggle("registration")}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Магазин</Label>
                <p className="text-sm text-zinc-400">
                  Включить функции магазина
                </p>
              </div>
              <Switch
                checked={settings.features.shop}
                onCheckedChange={() => handleFeatureToggle("shop")}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">События</Label>
                <p className="text-sm text-zinc-400">
                  Показывать раздел событий
                </p>
              </div>
              <Switch
                checked={settings.features.events}
                onCheckedChange={() => handleFeatureToggle("events")}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Объявления</Label>
                <p className="text-sm text-zinc-400">
                  Разрешить подачу объявлений
                </p>
              </div>
              <Switch
                checked={settings.features.classifieds}
                onCheckedChange={() => handleFeatureToggle("classifieds")}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Безопасность */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Icon name="Shield" className="h-5 w-5 mr-2" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Максимум попыток входа</Label>
              <Input
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      maxLoginAttempts: parseInt(e.target.value) || 5,
                    },
                  }))
                }
                disabled={!isEditing}
                className="bg-zinc-900 border-zinc-600"
                min="1"
                max="10"
              />
            </div>
            <div>
              <Label className="text-zinc-300">Таймаут сессии (секунды)</Label>
              <Input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    security: {
                      ...prev.security,
                      sessionTimeout: parseInt(e.target.value) || 3600,
                    },
                  }))
                }
                disabled={!isEditing}
                className="bg-zinc-900 border-zinc-600"
                min="300"
                max="86400"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-zinc-300">
                Двухфакторная аутентификация
              </Label>
              <p className="text-sm text-zinc-400">
                Обязательная 2FA для всех пользователей
              </p>
            </div>
            <Switch
              checked={settings.security.twoFactorRequired}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({
                  ...prev,
                  security: { ...prev.security, twoFactorRequired: checked },
                }))
              }
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Уведомления */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Icon name="Bell" className="h-5 w-5 mr-2" />
            Уведомления
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Email</Label>
                <p className="text-sm text-zinc-400">Email уведомления</p>
              </div>
              <Switch
                checked={settings.notifications.emailEnabled}
                onCheckedChange={() => handleNotificationToggle("emailEnabled")}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">SMS</Label>
                <p className="text-sm text-zinc-400">SMS уведомления</p>
              </div>
              <Switch
                checked={settings.notifications.smsEnabled}
                onCheckedChange={() => handleNotificationToggle("smsEnabled")}
                disabled={!isEditing}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-zinc-300">Push</Label>
                <p className="text-sm text-zinc-400">Push уведомления</p>
              </div>
              <Switch
                checked={settings.notifications.pushEnabled}
                onCheckedChange={() => handleNotificationToggle("pushEnabled")}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статус системы */}
      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Icon name="Activity" className="h-5 w-5 mr-2" />
            Статус системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                База данных
              </Badge>
            </div>
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                Файловая система
              </Badge>
            </div>
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-yellow-500 text-yellow-500"
              >
                <Icon name="AlertCircle" className="h-3 w-3 mr-1" />
                Кэш
              </Badge>
            </div>
            <div className="text-center">
              <Badge
                variant="outline"
                className="border-green-500 text-green-500"
              >
                <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                API
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
