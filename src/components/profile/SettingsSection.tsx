import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { UserProfile } from "@/types/profile";

interface SettingsSectionProps {
  user: UserProfile;
  onPreferenceChange: (
    key: keyof UserProfile["preferences"],
    value: boolean,
  ) => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  user,
  onPreferenceChange,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bell" className="h-5 w-5" />
            Уведомления
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base font-medium text-white">
                Email уведомления
              </Label>
              <p className="text-xs sm:text-sm text-zinc-400">
                Получать уведомления о заказах и новостях на email
              </p>
            </div>
            <Switch
              checked={user.preferences.emailNotifications}
              onCheckedChange={(checked) =>
                onPreferenceChange("emailNotifications", checked)
              }
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base font-medium text-white">
                SMS уведомления
              </Label>
              <p className="text-xs sm:text-sm text-zinc-400">
                Получать SMS о статусе заказов и важных обновлениях
              </p>
            </div>
            <Switch
              checked={user.preferences.smsNotifications}
              onCheckedChange={(checked) =>
                onPreferenceChange("smsNotifications", checked)
              }
            />
          </div>

          <Separator className="bg-zinc-800" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm sm:text-base font-medium text-white">
                Рассылка новостей
              </Label>
              <p className="text-xs sm:text-sm text-zinc-400">
                Получать информацию о новых товарах и акциях
              </p>
            </div>
            <Switch
              checked={user.preferences.newsletter}
              onCheckedChange={(checked) =>
                onPreferenceChange("newsletter", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Lock" className="h-5 w-5" />
            Безопасность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full sm:w-auto">
            <Icon name="Key" className="h-4 w-4 mr-2" />
            Изменить пароль
          </Button>

          <Button variant="outline" className="w-full sm:w-auto">
            <Icon name="Shield" className="h-4 w-4 mr-2" />
            Двухфакторная аутентификация
          </Button>

          <Separator className="bg-zinc-800" />

          <Button variant="destructive" className="w-full sm:w-auto">
            <Icon name="Trash2" className="h-4 w-4 mr-2" />
            Удалить аккаунт
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
