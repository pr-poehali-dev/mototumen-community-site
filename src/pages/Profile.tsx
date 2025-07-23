import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BikeInfo {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  imageUrl?: string;
}

interface Order {
  id: string;
  date: string;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
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
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newsletter: boolean;
  };

}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showAddBike, setShowAddBike] = useState(false);
  const [showStarfall, setShowStarfall] = useState(false);

  // Объединенный профиль пользователя с данными из Telegram и дополнительными полями
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: authUser?.id || 0,
    first_name: authUser?.firstName || "",
    last_name: authUser?.lastName || "",
    username: authUser?.username || "",
    photo_url: authUser?.photoUrl || "",
    phone: authUser?.phone || "",
    email: "",
    bio: authUser?.bio || "",
    experience: "",
    location: "",
    bikes: [
      {
        id: "demo-1",
        brand: "Honda",
        model: "CBR600RR", 
        year: 2021,
        type: "Спорт",
        imageUrl: "/api/placeholder/200/150",
      },
    ],
    joinDate: authUser?.joinDate || new Date().toISOString(),
    rating: 4.8,
    dealsCount: 12,
    isVerified: true,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
    },

  });

  // Демо заказы из ProfileNew
  const [orders] = useState<Order[]>([
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 45890,
      items: [
        {
          id: "1",
          name: "Шлем Bell Qualifier",
          quantity: 1,
          price: 15890,
          image: "/api/placeholder/60/60",
        },
        {
          id: "2", 
          name: "Перчатки Alpinestars",
          quantity: 2,
          price: 15000,
          image: "/api/placeholder/60/60",
        },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-28",
      status: "shipped",
      total: 23450,
      items: [
        {
          id: "3",
          name: "Масло моторное Motul",
          quantity: 3,
          price: 7816,
          image: "/api/placeholder/60/60",
        },
      ],
    },
  ]);

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    bio: "",
    experience: "",
    location: "",
  });

  const [newBike, setNewBike] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    type: "",
  });

  // Синхронизация с данными из Telegram
  useEffect(() => {
    if (authUser) {
      setUserProfile(prev => ({
        ...prev,
        id: authUser.id,
        first_name: authUser.firstName,
        last_name: authUser.lastName || "",
        username: authUser.username || "",
        photo_url: authUser.photoUrl || "",
        joinDate: authUser.joinDate,
        phone: authUser.phone || "",
        bio: authUser.bio || ""
      }));
      setEditForm({
        first_name: authUser.firstName,
        last_name: authUser.lastName || "",
        phone: authUser.phone || "",
        email: "",
        bio: authUser.bio || "",
        experience: "",
        location: "",
      });
    }
  }, [authUser]);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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

  const handlePreferenceChange = (
    key: keyof UserProfile["preferences"],
    value: boolean,
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "confirmed":
        return "Подтвержден";
      case "shipped":
        return "Отправлен";
      case "delivered":
        return "Доставлен";
      case "cancelled":
        return "Отменен";
      default:
        return "Неизвестно";
    }
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  const handleFavoriteClick = () => {
    setShowStarfall(true);
    setTimeout(() => setShowStarfall(false), 2000);
  };

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

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Анимация звездопада */}
      {showStarfall && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s'
              }}
            >
              <Icon name="Star" className="h-4 w-4 text-yellow-400" />
            </div>
          ))}
        </div>
      )}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <Icon name="ArrowLeft" className="h-5 w-5" />
                </Button>
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{ fontFamily: "Oswald, sans-serif" }}
                >
                  Личный кабинет
                </h1>
              </div>
              <p className="text-sm sm:text-base text-zinc-400 ml-10">
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
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                        <AvatarImage src={userProfile.photo_url} alt={userProfile.first_name} />
                        <AvatarFallback className="text-lg sm:text-xl bg-accent">
                          {userProfile.first_name.charAt(0).toUpperCase()}
                          {userProfile.last_name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2
                            className="text-lg sm:text-xl md:text-2xl font-bold"
                            style={{ fontFamily: "Oswald, sans-serif" }}
                          >
                            {userProfile.first_name} {userProfile.last_name}
                          </h2>
                          {userProfile.isVerified && (
                            <Badge className="bg-green-600 text-white">
                              <Icon name="CheckCircle" className="h-3 w-3 mr-1" />
                              Верифицирован
                            </Badge>
                          )}
                          <button
                            onClick={handleFavoriteClick}
                            className="ml-2 p-1 rounded transition-all duration-200 hover:bg-yellow-500/20 hover:border-yellow-400 border border-transparent"
                            title="Избранное"
                          >
                            <Icon 
                              name="Star" 
                              className="h-5 w-5 text-yellow-400 hover:text-yellow-300 transition-colors duration-200" 
                            />
                          </button>
                        </div>
                        <p className="text-sm text-zinc-400">@{userProfile.username}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                          {userProfile.rating > 0 && (
                            <div className="flex items-center gap-1">
                              <Icon name="Star" className="h-4 w-4 text-yellow-400" />
                              <span>{userProfile.rating}</span>
                            </div>
                          )}
                          {userProfile.dealsCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Icon name="ShoppingBag" className="h-4 w-4" />
                              <span>{userProfile.dealsCount} сделок</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "default" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="w-full sm:w-auto"
                    >
                      <Icon
                        name={isEditing ? "Save" : "Edit"}
                        className="h-4 w-4 mr-2"
                      />
                      {isEditing ? "Сохранить" : "Редактировать"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <Label htmlFor="first_name" className="text-sm font-medium">
                          Имя
                        </Label>
                        <Input
                          id="first_name"
                          value={isEditing ? editForm.first_name : userProfile.first_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              first_name: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name" className="text-sm font-medium">
                          Фамилия
                        </Label>
                        <Input
                          id="last_name"
                          value={isEditing ? editForm.last_name : userProfile.last_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              last_name: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Телефон
                        </Label>
                        <Input
                          id="phone"
                          value={isEditing ? editForm.phone : userProfile.phone || "Не указан"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="+7 (XXX) XXX-XX-XX"
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={isEditing ? editForm.email : userProfile.email || "Не указан"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              email: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="your@email.com"
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <Label htmlFor="bio" className="text-sm font-medium">
                          О себе
                        </Label>
                        <Textarea
                          id="bio"
                          value={isEditing ? editForm.bio : userProfile.bio || "Информация не указана"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              bio: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="Расскажите о себе..."
                          className="bg-zinc-800 border-zinc-700 text-sm min-h-[120px]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience" className="text-sm font-medium">
                          Опыт вождения
                        </Label>
                        <Input
                          id="experience"
                          value={isEditing ? editForm.experience : userProfile.experience || "Не указан"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              experience: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="1 год, 5 лет, с детства..."
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-sm font-medium">
                          Город
                        </Label>
                        <Input
                          id="location"
                          value={isEditing ? editForm.location : userProfile.location || "Не указан"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              location: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          placeholder="Тюмень, Москва, Екатеринбург..."
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                    </div>
                  </div>



                  <div>
                    <Label className="text-gray-400">Дата регистрации</Label>
                    <p className="text-white">
                      {new Date(userProfile.joinDate).toLocaleDateString("ru-RU")}
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto"
                      >
                        <Icon name="X" className="h-4 w-4 mr-2" />
                        Отмена
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                      >
                        <Icon name="Save" className="h-4 w-4 mr-2" />
                        Сохранить изменения
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Заказы */}
            <TabsContent value="orders" className="space-y-4 sm:space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle
                    className="text-lg sm:text-xl"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    История заказов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-zinc-800 rounded-lg p-4 sm:p-6"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-sm sm:text-base">
                              Заказ #{order.id}
                            </h4>
                            <p className="text-xs sm:text-sm text-zinc-400">
                              от {new Date(order.date).toLocaleDateString("ru-RU")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={`${getStatusColor(order.status)} text-white text-xs`}
                            >
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="font-semibold text-sm sm:text-base">
                              {order.total.toLocaleString()} ₽
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 sm:gap-4"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded object-cover"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm sm:text-base">
                                  {item.name}
                                </h5>
                                <p className="text-xs sm:text-sm text-zinc-400">
                                  {item.quantity} шт. × {item.price.toLocaleString()} ₽
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-zinc-800">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            <Icon name="Eye" className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                          {order.status === "delivered" && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
                              Повторить заказ
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Настройки */}
            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle
                    className="text-lg sm:text-xl"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    Настройки уведомлений
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Email уведомления</Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать уведомления о заказах на email
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailNotifications", checked)
                      }
                    />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">SMS уведомления</Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать SMS о статусе заказов
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("smsNotifications", checked)
                      }
                    />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Новостная рассылка</Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать информацию о новых товарах и акциях
                      </p>
                    </div>
                    <Switch
                      checked={userProfile.preferences.newsletter}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("newsletter", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle
                    className="text-lg sm:text-xl"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
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
            </TabsContent>

            {/* Гараж */}
            <TabsContent value="garage" className="space-y-4 sm:space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span style={{ fontFamily: "Oswald, sans-serif" }}>Мой гараж</span>
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
                    <Card className="mb-6 bg-zinc-800 border-zinc-700">
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
                                setNewBike({ ...newBike, brand: e.target.value })
                              }
                              placeholder="Honda, Yamaha, Kawasaki..."
                              className="bg-zinc-700 border-zinc-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="model">Модель</Label>
                            <Input
                              id="model"
                              value={newBike.model}
                              onChange={(e) =>
                                setNewBike({ ...newBike, model: e.target.value })
                              }
                              placeholder="CBR600RR, MT-07..."
                              className="bg-zinc-700 border-zinc-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="year">Год</Label>
                            <Input
                              id="year"
                              type="number"
                              value={newBike.year}
                              onChange={(e) =>
                                setNewBike({ ...newBike, year: parseInt(e.target.value) })
                              }
                              min="1900"
                              max={new Date().getFullYear()}
                              className="bg-zinc-700 border-zinc-600"
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
                              className="bg-zinc-700 border-zinc-600"
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
                          <Button variant="outline" onClick={() => setShowAddBike(false)}>
                            Отмена
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.bikes.map((bike) => (
                      <Card key={bike.id} className="bg-zinc-800 border-zinc-700">
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
                      <Icon name="Car" className="h-16 w-16 mx-auto mb-4 opacity-50" />
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