import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    motorcycle: {
      brand: user?.motorcycle?.brand || "",
      model: user?.motorcycle?.model || "",
      year: user?.motorcycle?.year || new Date().getFullYear(),
    },
  });

  const handleSave = async () => {
    await updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.bio,
      phone: formData.phone,
      motorcycle: formData.motorcycle,
    });
    setIsEditing(false);
  };

  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500";
      case "moderator":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "moderator":
        return "Модератор";
      default:
        return "Пользователь";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-4xl font-bold"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Личный кабинет
            </h1>
            <Button variant="outline" onClick={logout}>
              <Icon name="LogOut" className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Профиль</TabsTrigger>
              <TabsTrigger value="favorites">Избранное</TabsTrigger>
              <TabsTrigger value="orders">Заказы</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoUrl} alt={user.firstName} />
                        <AvatarFallback className="text-xl">
                          {user.firstName.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2
                          className="text-2xl font-bold"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-muted-foreground">
                          @{user.username}
                        </p>
                        <Badge
                          className={`${getRoleColor(user.role)} text-white mt-2`}
                        >
                          {getRoleText(user.role)}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Icon
                        name={isEditing ? "Save" : "Edit"}
                        className="h-4 w-4 mr-2"
                      />
                      {isEditing ? "Сохранить" : "Редактировать"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">Имя</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Фамилия</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="+7 (XXX) XXX-XX-XX"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bio">О себе</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="Расскажите о себе..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Мой мотоцикл
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="brand">Марка</Label>
                        <Input
                          id="brand"
                          value={formData.motorcycle.brand}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              motorcycle: {
                                ...prev.motorcycle,
                                brand: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="Honda, Yamaha, Kawasaki..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Модель</Label>
                        <Input
                          id="model"
                          value={formData.motorcycle.model}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              motorcycle: {
                                ...prev.motorcycle,
                                model: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="CBR600RR, R1, Ninja..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="year">Год</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.motorcycle.year}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              motorcycle: {
                                ...prev.motorcycle,
                                year: parseInt(e.target.value),
                              },
                            }))
                          }
                          disabled={!isEditing}
                          min="1900"
                          max={new Date().getFullYear() + 1}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Сохранить изменения
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Избранное</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Icon
                      name="Heart"
                      className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                    />
                    <h3 className="text-lg font-semibold mb-2">Пока пусто</h3>
                    <p className="text-muted-foreground">
                      Добавляйте товары, услуги и объявления в избранное
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Мои заказы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Icon
                      name="Package"
                      className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                    />
                    <h3 className="text-lg font-semibold mb-2">
                      Заказов пока нет
                    </h3>
                    <p className="text-muted-foreground">
                      Здесь будут отображаться ваши заказы и покупки
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Уведомления</h4>
                        <p className="text-sm text-muted-foreground">
                          Получать уведомления о новых событиях
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Настроить
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Конфиденциальность</h4>
                        <p className="text-sm text-muted-foreground">
                          Управление приватностью профиля
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Настроить
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Опасная зона</h4>
                    <Button variant="destructive" size="sm">
                      Удалить аккаунт
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
