import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

const ZMStoreSellerAdd = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [telegramId, setTelegramId] = useState('');
  const [fullName, setFullName] = useState('');



  const addSeller = async () => {
    if (!telegramId.trim() || !fullName.trim()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b9e68923-db5a-4903-9eb9-7ff37e2337c7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({
          telegram_id: telegramId,
          full_name: fullName
        })
      });

      if (response.ok) {
        toast({
          title: "Успешно",
          description: "Продавец добавлен"
        });
        navigate('/zm-store');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add seller');
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить продавца",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate('/zm-store')}>
            <Icon name="ArrowLeft" className="mr-2" size={16} />
            Назад
          </Button>
          <h1 className="text-3xl font-bold">Добавить продавца</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Данные нового продавца</CardTitle>
              <CardDescription>
                Введите Telegram ID и полное имя пользователя
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram_id">Telegram ID</Label>
                <Input
                  id="telegram_id"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="573967828"
                  type="text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Полное имя</Label>
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иван Иванов"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Подтверждение</CardTitle>
              <CardDescription>
                Этот пользователь получит доступ к управлению товарами ZM Store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">Права продавца:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Добавление и редактирование товаров</li>
                    <li>• Удаление товаров</li>
                    <li>• Управление наличием и ценами</li>
                    <li>• Просмотр всех товаров магазина</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={addSeller}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Добавление..." : "Назначить продавцом"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/zm-store')}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Подсказка</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Telegram ID можно узнать у пользователя или из его профиля</p>
              <p>• Один Telegram ID может быть назначен продавцом только один раз</p>
              <p>• Активировать/деактивировать продавца можно на главной странице панели управления</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ZMStoreSellerAdd;