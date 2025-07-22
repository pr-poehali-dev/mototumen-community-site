import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BikeInfo {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  imageUrl?: string;
}

interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  photo_url: string;
  phone?: string;
  email?: string;
  bio?: string;
  experience?: string;
  location?: string;
  bikes: BikeInfo[];
  joinDate: string;
  rating: number;
  dealsCount: number;
  isVerified: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showAddBike, setShowAddBike] = React.useState(false);

  // Синхронизированные данные пользователя с Telegram
  const [userProfile, setUserProfile] = React.useState<UserProfile>({
    id: authUser?.id || 0,
    first_name: authUser?.firstName || "",
    last_name: authUser?.lastName || "", // из Telegram, может быть пустым
    username: authUser?.username || "", // из Telegram, может быть пустым
    photo_url: authUser?.photoUrl || "", // из Telegram, может быть пустым
    phone: authUser?.phone || "", // пустое поле для заполнения пользователем
    email: "", // пустое поле для заполнения пользователем
    bio: authUser?.bio || "", // пустое поле для заполнения пользователем
    experience: "", // пустое поле для заполнения пользователем
    location: "", // пустое поле для заполнения пользователем
    bikes: [
      {
        id: "demo-1",
        brand: "Honda",
        model: "CBR600RR",
        year: 2021,
        type: "Спорт",
        imageUrl: "/api/placeholder/200/150",
      },
    ], // один демо мотоцикл как в билде 21b9ab8
    joinDate: authUser?.joinDate || new Date().toISOString(),
    rating: 0, // начальный рейтинг
    dealsCount: 0, // начальное количество сделок
    isVerified: false, // начальная верификация
  });

  const [editForm, setEditForm] = React.useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    bio: "",
    experience: "",
    location: "",
  });

  const [newBike, setNewBike] = React.useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    type: "",
  });

  const handleSaveProfile = () => {
    setUserProfile((prev) => ({
      ...prev,
      ...editForm,
    }));
    setIsEditing(false);
    toast({
      title: "Профиль обновлен",
      description: "Ваши данные успешно сохранены",
    });
  };

  const handleAddBike = () => {
    if (newBike.brand && newBike.model) {
      const bike: BikeInfo = {
        id: Date.now().toString(),
        ...newBike,
        imageUrl: "/api/placeholder/200/150",
      };
      setUserProfile((prev) => ({
        ...prev,
        bikes: [...prev.bikes, bike],
      }));
      setNewBike({
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        type: "",
      });
      setShowAddBike(false);
      toast({
        title: "Мотоцикл добавлен",
        description: "Новый мотоцикл добавлен в ваш гараж",
      });
    }
  };

  const handleDeleteBike = (bikeId: string) => {
    setUserProfile((prev) => ({
      ...prev,
      bikes: prev.bikes.filter((bike) => bike.id !== bikeId),
    }));
    toast({
      title: "Мотоцикл удален",
      description: "Мотоцикл удален из вашего гаража",
    });
  };

  // Синхронизируем только данные из Telegram, остальное оставляем пустым
  useEffect(() => {
    if (authUser) {
      setUserProfile(prev => ({
        ...prev,
        id: authUser.id,
        first_name: authUser.firstName, // из Telegram
        last_name: authUser.lastName || "", // из Telegram, может быть пустым
        username: authUser.username || "", // из Telegram, может быть пустым  
        photo_url: authUser.photoUrl || "", // из Telegram, может быть пустым
        joinDate: authUser.joinDate,
        phone: authUser.phone || "", // из профиля пользователя или пустое
        bio: authUser.bio || "" // из профиля пользователя или пустое
      }));
      setEditForm({
        first_name: authUser.firstName,
        last_name: authUser.lastName || "",
        phone: authUser.phone || "", // пустое поле для заполнения
        email: "", // пустое поле для заполнения
        bio: authUser.bio || "", // пустое поле для заполнения
        experience: "", // пустое поле для заполнения
        location: "" // пустое поле для заполнения
      });
    }
  }, [authUser]);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Если не авторизован, показываем заглушку
  if (!isAuthenticated || !authUser) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  // Функция выхода с редиректом
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "Oswald, sans-serif" }}
              >
                Личный кабинет
              </h1>
              <p className="text-sm sm:text-base text-zinc-400">
                Управляйте своим профилем и заказами
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleLogoutClick}
            >
              <Icon name="LogOut" className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-zinc-900 mb-6 sm:mb-8">
              <TabsTrigger value="profile" className="text-xs sm:text-sm">
                <Icon name="User" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="text-xs sm:text-sm">
                <Icon name="ShoppingBag" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Заказы</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Icon name="Settings" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Настройки</span>
              </TabsTrigger>
              <TabsTrigger value="garage" className="text-xs sm:text-sm">
                <Icon name="Car" className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Гараж</span>
              </TabsTrigger>
            </TabsList>

            {/* Профиль */}
            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Основная информация</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Icon
                        name={isEditing ? "X" : "Edit"}
                        className="h-4 w-4 mr-2"
                      />
                      {isEditing ? "Отмена" : "Редактировать"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Аватар и статус */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {userProfile.photo_url ? (
                          <img
                            src={userProfile.photo_url}
                            alt="Аватар"
                            className="w-32 h-32 rounded-full object-cover border-4 border-accent"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-32 h-32 rounded-full border-4 border-accent bg-accent flex items-center justify-center ${userProfile.photo_url ? 'hidden' : 'flex'}`}>
                          <span className="text-4xl font-bold text-white">
                            {userProfile.first_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-bold">
                            {userProfile.first_name} {userProfile.last_name}
                          </h2>
                          {userProfile.isVerified && (
                            <Badge className="bg-green-600">
                              <Icon
                                name="CheckCircle"
                                className="h-3 w-3 mr-1"
                              />
                              Верифицирован
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400">@{userProfile.username}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {userProfile.rating > 0 && (
                            <div className="flex items-center space-x-1">
                              <Icon
                                name="Star"
                                className="h-4 w-4 text-yellow-400"
                              />
                              <span>{userProfile.rating}</span>
                            </div>
                          )}
                          {userProfile.dealsCount > 0 && (
                            <div className="flex items-center space-x-1">
                              <Icon name="ShoppingBag" className="h-4 w-4" />
                              <span>{userProfile.dealsCount} сделок</span>
                            </div>
                          )}
                          {userProfile.rating === 0 && userProfile.dealsCount === 0 && (
                            <div className="text-xs text-gray-500">
                              <Icon name="User" className="h-4 w-4 inline mr-1" />
                              Новый пользователь
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="md:col-span-2 space-y-4">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="first_name">Имя</Label>
                              <Input
                                id="first_name"
                                value={editForm.first_name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    first_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="last_name">Фамилия</Label>
                              <Input
                                id="last_name"
                                value={editForm.last_name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    last_name: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Телефон</Label>
                              <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="+7 (900) 123-45-67"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    email: e.target.value,
                                  })
                                }
                                placeholder="your@email.com"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="location">Город</Label>
                              <Input
                                id="location"
                                value={editForm.location}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    location: e.target.value,
                                  })
                                }
                                placeholder="Тюмень, Москва, Екатеринбург..."
                              />
                            </div>
                            <div>
                              <Label htmlFor="experience">Опыт вождения</Label>
                              <Input
                                id="experience"
                                value={editForm.experience}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    experience: e.target.value,
                                  })
                                }
                                placeholder="1 год, 5 лет, с детства..."
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="bio">О себе</Label>
                            <Textarea
                              id="bio"
                              value={editForm.bio}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  bio: e.target.value,
                                })
                              }
                              rows={3}
                              placeholder="Расскажите о своих увлечениях, опыте, любимых маршрутах..."
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleSaveProfile}
                              className="bg-accent hover:bg-accent/90"
                            >
                              <Icon name="Save" className="h-4 w-4 mr-2" />
                              Сохранить
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditing(false)}
                            >
                              Отмена
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-400">Телефон</Label>
                              <p className="text-white">
                                {userProfile.phone || "Не указан"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-gray-400">Email</Label>
                              <p className="text-white">
                                {userProfile.email || "Не указан"}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-400">Город</Label>
                              <p className="text-white">
                                {userProfile.location || "Не указан"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-gray-400">
                                Опыт вождения
                              </Label>
                              <p className="text-white">
                                {userProfile.experience || "Не указан"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-400">О себе</Label>
                            <p className="text-white">
                              {userProfile.bio || "Информация не указана"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-400">
                              Дата регистрации
                            </Label>
                            <p className="text-white">
                              {new Date(
                                userProfile.joinDate,
                              ).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Заказы */}
            <TabsContent value="orders" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>История заказов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-400">
                    <Icon
                      name="ShoppingBag"
                      className="h-16 w-16 mx-auto mb-4 opacity-50"
                    />
                    <p>У вас пока нет заказов</p>
                    <p className="text-sm">
                      Посетите наш магазин, чтобы сделать первый заказ!
                    </p>
                    <Button
                      className="mt-4 bg-accent hover:bg-accent/90"
                      onClick={() => navigate("/shop")}
                    >
                      Перейти в магазин
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Настройки */}
            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки аккаунта</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Уведомления
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Email уведомления</span>
                          <Button variant="outline" size="sm">
                            Включить
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Push уведомления</span>
                          <Button variant="outline" size="sm">
                            Включить
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Приватность
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Показывать профиль в поиске</span>
                          <Button variant="outline" size="sm">
                            Включено
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Показывать онлайн статус</span>
                          <Button variant="outline" size="sm">
                            Включено
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        Опасная зона
                      </h3>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Icon name="Trash2" className="h-4 w-4 mr-2" />
                        Удалить аккаунт
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Гараж */}
            <TabsContent value="garage" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Мой гараж</span>
                    <Button
                      onClick={() => setShowAddBike(true)}
                      className="bg-accent hover:bg-accent/90"
                    >
                      <Icon name="Plus" className="h-4 w-4 mr-2" />
                      Добавить мотоцикл
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showAddBike && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Добавить мотоцикл</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="brand">Марка</Label>
                            <Input
                              id="brand"
                              value={newBike.brand}
                              onChange={(e) =>
                                setNewBike({
                                  ...newBike,
                                  brand: e.target.value,
                                })
                              }
                              placeholder="Honda, Yamaha, Kawasaki..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="model">Модель</Label>
                            <Input
                              id="model"
                              value={newBike.model}
                              onChange={(e) =>
                                setNewBike({
                                  ...newBike,
                                  model: e.target.value,
                                })
                              }
                              placeholder="CBR600RR, MT-07..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="year">Год</Label>
                            <Input
                              id="year"
                              type="number"
                              value={newBike.year}
                              onChange={(e) =>
                                setNewBike({
                                  ...newBike,
                                  year: parseInt(e.target.value),
                                })
                              }
                              min="1900"
                              max={new Date().getFullYear()}
                            />
                          </div>
                          <div>
                            <Label htmlFor="type">Тип</Label>
                            <Input
                              id="type"
                              value={newBike.type}
                              onChange={(e) =>
                                setNewBike({ ...newBike, type: e.target.value })
                              }
                              placeholder="Спорт, Нейкед, Круизер..."
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button
                            onClick={handleAddBike}
                            className="bg-accent hover:bg-accent/90"
                          >
                            <Icon name="Plus" className="h-4 w-4 mr-2" />
                            Добавить
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddBike(false)}
                          >
                            Отмена
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.bikes.map((bike) => (
                      <Card key={bike.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                              <Icon name="Bike" className="h-10 w-10 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">
                                {bike.brand} {bike.model}
                              </h3>
                              <p className="text-gray-400">{bike.year} г.</p>
                              <Badge variant="secondary">{bike.type}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBike(bike.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Icon name="Trash2" className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {userProfile.bikes.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Icon
                        name="Car"
                        className="h-16 w-16 mx-auto mb-4 opacity-50"
                      />
                      <p>У вас пока нет мотоциклов в гараже</p>
                      <p className="text-sm">Добавьте свой первый мотоцикл!</p>
                    </div>
                  )}
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