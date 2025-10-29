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
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState<{
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  } | null>(null);

  const searchUser = async () => {
    if (!username.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/c14b9fa1-22f4-42a9-9a01-3c63fdcc9e80?username=${encodeURIComponent(username)}`, {
        headers: { 'X-Auth-Token': token || '' }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUserInfo(data.user);
        } else {
          toast({
            title: "Не найдено",
            description: "Пользователь с таким username не найден",
            variant: "destructive"
          });
          setUserInfo(null);
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось найти пользователя",
        variant: "destructive"
      });
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const addSeller = async () => {
    if (!userInfo) return;

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/998bd736-839c-4b49-ab49-51997ba59af8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': token || ''
        },
        body: JSON.stringify({
          userId: userInfo.id
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
              <CardTitle>Поиск пользователя</CardTitle>
              <CardDescription>
                Введите username пользователя, которого хотите назначить продавцом ZM Store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ivan_ivanov"
                    onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                  />
                  <Button onClick={searchUser} disabled={loading}>
                    <Icon name="Search" size={16} className="mr-2" />
                    Найти
                  </Button>
                </div>
              </div>

              {userInfo && (
                <Card className="bg-muted">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {userInfo.firstName} {userInfo.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{userInfo.username}</p>
                        <p className="text-xs text-muted-foreground mt-1">ID: {userInfo.id}</p>
                      </div>
                      <Icon name="User" size={48} className="text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {userInfo && (
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
          )}

          <Card>
            <CardHeader>
              <CardTitle>Подсказка</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Username можно узнать в профиле пользователя</p>
              <p>• Пользователь должен быть зарегистрирован в системе</p>
              <p>• Один пользователь может быть назначен продавцом только один раз</p>
              <p>• Удалить продавца можно на главной странице панели управления</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ZMStoreSellerAdd;
