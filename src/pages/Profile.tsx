import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import ImageUpload from "@/components/ui/ImageUpload";
import { useAuth } from "@/hooks/useAuth";

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

interface Vehicle {
  id: string;
  type: "motorcycle" | "car" | "scooter" | "atv";
  brand: string;
  model: string;
  year: number;
  engine: string;
  color: string;
  mileage: number;
  status: "active" | "sold" | "repair";
  photo: string;
  description: string;
  createdAt: string;
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  photoUrl: string;
  bio: string;
  role: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newsletter: boolean;
  };
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, handleLogout } = useAuth();

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Если не авторизован, показываем загрузку
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
    handleLogout();
    navigate("/");
  };

  const [user, setUser] = useState<UserProfile>({
    id: authUser.id.toString(),
    firstName: authUser.first_name,
    lastName: authUser.last_name || "",
    username: authUser.username || "",
    email: `${authUser.username}@telegram.user`,
    phone: "+7 (999) 123-45-67",
    photoUrl: authUser.photo_url || "/api/placeholder/150/150",
    bio: "Любитель мототехники и скорости. Участник соревнований по мотокроссу.",
    role: "user",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
    },
    address: {
      street: "ул. Ленина, 123",
      city: "Тюмень",
      zipCode: "625000",
      country: "Россия",
    },
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      type: "motorcycle",
      brand: "Honda",
      model: "CBR600RR",
      year: 2022,
      engine: "599cc",
      color: "Красный",
      mileage: 15000,
      status: "active",
      photo: "/api/placeholder/300/200",
      description: "Отличное состояние, регулярное тО",
      createdAt: "2024-01-15",
    },
  ]);

  const [mainVehicleId, setMainVehicleId] = useState<string>("1");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

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
    {
      id: "ORD-2024-003",
      date: "2024-02-05",
      status: "pending",
      total: 67890,
      items: [
        {
          id: "4",
          name: "Комплект защиты Fox",
          quantity: 1,
          price: 67890,
          image: "/api/placeholder/60/60",
        },
      ],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    phone: user.phone,
    address: {
      street: user.address.street,
      city: user.address.city,
      zipCode: user.address.zipCode,
      country: user.address.country,
    },
  });

  const handleSave = async () => {
    setUser((prev) => ({
      ...prev,
      firstName: formData.firstName,
      lastName: formData.lastName,
      bio: formData.bio,
      phone: formData.phone,
      address: formData.address,
    }));
    setIsEditing(false);
  };

  const handlePreferenceChange = (
    key: keyof UserProfile["preferences"],
    value: boolean,
  ) => {
    setUser((prev) => ({
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

  const getVehicleTypeText = (type: Vehicle["type"]) => {
    switch (type) {
      case "motorcycle":
        return "Мотоцикл";
      case "car":
        return "Автомобиль";
      case "scooter":
        return "Скутер";
      case "atv":
        return "Квадроцикл";
      default:
        return "Транспорт";
    }
  };

  const getVehicleStatusText = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "Активный";
      case "sold":
        return "Продан";
      case "repair":
        return "В ремонте";
      default:
        return "Неизвестно";
    }
  };

  const getVehicleStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "sold":
        return "bg-red-500";
      case "repair":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter((v) => v.id !== vehicleId));
    if (mainVehicleId === vehicleId) {
      const remaining = vehicles.filter((v) => v.id !== vehicleId);
      setMainVehicleId(remaining.length > 0 ? remaining[0].id : "");
    }
  };

  const handleSetMainVehicle = (vehicleId: string) => {
    setMainVehicleId(vehicleId);
  };

  const handleSaveVehicle = (vehicleData: Partial<Vehicle>) => {
    if (editingVehicle) {
      // Редактирование существующего
      setVehicles(
        vehicles.map((v) =>
          v.id === editingVehicle.id ? { ...v, ...vehicleData } : v,
        ),
      );
      setEditingVehicle(null);
    } else {
      // Добавление нового
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        type: vehicleData.type || "motorcycle",
        brand: vehicleData.brand || "",
        model: vehicleData.model || "",
        year: vehicleData.year || new Date().getFullYear(),
        engine: vehicleData.engine || "",
        color: vehicleData.color || "",
        mileage: vehicleData.mileage || 0,
        status: vehicleData.status || "active",
        photo: vehicleData.photo || "/api/placeholder/300/200",
        description: vehicleData.description || "",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setVehicles([...vehicles, newVehicle]);

      // Если это первый транспорт, делаем его основным
      if (vehicles.length === 0) {
        setMainVehicleId(newVehicle.id);
      }

      setIsAddingVehicle(false);
    }
  };

  // Компонент карточки транспорта
  const VehicleCard: React.FC<{
    vehicle: Vehicle;
    isMain: boolean;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicleId: string) => void;
    onSetMain: (vehicleId: string) => void;
  }> = ({ vehicle, isMain, onEdit, onDelete, onSetMain }) => {
    const getVehicleTypeText = (type: Vehicle["type"]) => {
      switch (type) {
        case "motorcycle":
          return "Мотоцикл";
        case "car":
          return "Автомобиль";
        case "scooter":
          return "Скутер";
        case "atv":
          return "Квадроцикл";
        default:
          return "Транспорт";
      }
    };

    return (
      <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">
              {vehicle.brand} {vehicle.model}
            </h4>
            {isMain && (
              <Badge className="bg-orange-500 text-white text-xs">
                Основной
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(vehicle)}
              className="h-8 w-8 p-0"
            >
              <Icon name="Edit" className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(vehicle.id)}
              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
            >
              <Icon name="Trash2" className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="aspect-video rounded-lg overflow-hidden">
          <img
            src={vehicle.photo}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Тип:</span>
            <span>{getVehicleTypeText(vehicle.type)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Год:</span>
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Двигатель:</span>
            <span>{vehicle.engine}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Цвет:</span>
            <span>{vehicle.color}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Пробег:</span>
            <span>{vehicle.mileage.toLocaleString()} км</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">Статус:</span>
            <Badge
              className={`${getVehicleStatusColor(vehicle.status)} text-white text-xs`}
            >
              {getVehicleStatusText(vehicle.status)}
            </Badge>
          </div>
        </div>

        {vehicle.description && (
          <div className="text-sm text-zinc-400 border-t border-zinc-700 pt-2">
            <p>{vehicle.description}</p>
          </div>
        )}

        <div className="flex gap-2">
          {!isMain && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetMain(vehicle.id)}
              className="text-xs"
            >
              <Icon name="Star" className="h-3 w-3 mr-1" />
              Сделать основным
            </Button>
          )}
        </div>
      </div>
    );
  };

  // Модальное окно для добавления/редактирования транспорта
  const VehicleModal: React.FC<{
    vehicle?: Vehicle | null;
    onSave: (vehicle: Partial<Vehicle>) => void;
    onCancel: () => void;
  }> = ({ vehicle, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      type: vehicle?.type || "motorcycle",
      brand: vehicle?.brand || "",
      model: vehicle?.model || "",
      year: vehicle?.year || new Date().getFullYear(),
      engine: vehicle?.engine || "",
      color: vehicle?.color || "",
      mileage: vehicle?.mileage || 0,
      status: vehicle?.status || "active",
      photo: vehicle?.photo || "/api/placeholder/300/200",
      description: vehicle?.description || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-zinc-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">
            {vehicle ? "Редактировать транспорт" : "Добавить транспорт"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Тип транспорта</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Vehicle["type"],
                    })
                  }
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
                >
                  <option value="motorcycle">Мотоцикл</option>
                  <option value="car">Автомобиль</option>
                  <option value="scooter">Скутер</option>
                  <option value="atv">Квадроцикл</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Vehicle["status"],
                    })
                  }
                  className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
                >
                  <option value="active">Активный</option>
                  <option value="sold">Продан</option>
                  <option value="repair">В ремонте</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Марка</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                  placeholder="Honda, Toyota, BMW..."
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Модель</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  placeholder="CBR600RR, Camry, X5..."
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Год</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="bg-zinc-800 border-zinc-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="engine">Двигатель</Label>
                <Input
                  id="engine"
                  value={formData.engine}
                  onChange={(e) =>
                    setFormData({ ...formData, engine: e.target.value })
                  }
                  placeholder="599cc, 2.0L, 3.0L..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div>
                <Label htmlFor="color">Цвет</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="Красный, Синий, Черный..."
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mileage">Пробег (км)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    mileage: parseInt(e.target.value),
                  })
                }
                min="0"
                placeholder="15000"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="photo">Фотография</Label>
              <ImageUpload
                currentImage={formData.photo}
                onImageChange={(url) =>
                  setFormData({ ...formData, photo: url })
                }
                variant="compact"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Дополнительная информация о транспорте..."
                className="bg-zinc-800 border-zinc-700 min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {vehicle ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
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

            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                        <AvatarImage src={user.photoUrl} alt={user.firstName} />
                        <AvatarFallback className="text-lg sm:text-xl">
                          {user.firstName.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h2
                          className="text-lg sm:text-xl md:text-2xl font-bold"
                          style={{ fontFamily: "Oswald, sans-serif" }}
                        >
                          {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-sm text-zinc-400">
                          @{user.username}
                        </p>
                        <p className="text-sm text-zinc-400">{user.email}</p>
                        <Badge
                          className={`${getRoleColor(user.role)} text-white mt-2 text-xs`}
                        >
                          {getRoleText(user.role)}
                        </Badge>
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
                        <Label
                          htmlFor="firstName"
                          className="text-sm font-medium"
                        >
                          Имя
                        </Label>
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
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="lastName"
                          className="text-sm font-medium"
                        >
                          Фамилия
                        </Label>
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
                          className="bg-zinc-800 border-zinc-700 text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Телефон
                        </Label>
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
                          value={formData.bio}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              bio: e.target.value,
                            }))
                          }
                          disabled={!isEditing}
                          placeholder="Расскажите о себе..."
                          className="bg-zinc-800 border-zinc-700 text-sm min-h-[120px]"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div className="space-y-3 sm:space-y-4">
                    <Label className="text-sm font-medium">Адрес</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <Label className="text-xs text-zinc-400">Улица</Label>
                        <Input
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                street: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-400">Город</Label>
                        <Input
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-400">Индекс</Label>
                        <Input
                          value={formData.address.zipCode}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                zipCode: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-zinc-400">Страна</Label>
                        <Input
                          value={formData.address.country}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                country: e.target.value,
                              },
                            }))
                          }
                          disabled={!isEditing}
                          className="bg-zinc-800 border-zinc-700 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-zinc-800" />

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
                        onClick={handleSave}
                        className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                      >
                        <Icon name="Save" className="h-4 w-4 mr-2" />
                        Сохранить изменения
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="garage">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className="text-lg sm:text-xl"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Мой гараж
                    </CardTitle>
                    <Button
                      onClick={() => setIsAddingVehicle(true)}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Icon name="Plus" className="h-4 w-4 mr-2" />
                      Добавить транспорт
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicles.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon
                        name="Car"
                        className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-zinc-500"
                      />
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        Гараж пуст
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 mb-4">
                        Добавьте свой транспорт для учета и управления
                      </p>
                      <Button
                        onClick={() => setIsAddingVehicle(true)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        <Icon name="Plus" className="h-4 w-4 mr-2" />
                        Добавить первый транспорт
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          isMain={vehicle.id === mainVehicleId}
                          onEdit={handleEditVehicle}
                          onDelete={handleDeleteVehicle}
                          onSetMain={handleSetMainVehicle}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {(isAddingVehicle || editingVehicle) && (
                <VehicleModal
                  vehicle={editingVehicle}
                  onSave={handleSaveVehicle}
                  onCancel={() => {
                    setIsAddingVehicle(false);
                    setEditingVehicle(null);
                  }}
                />
              )}
            </TabsContent>

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
                              от{" "}
                              {new Date(order.date).toLocaleDateString("ru-RU")}
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
                                  {item.quantity} шт. ×{" "}
                                  {item.price.toLocaleString()} ₽
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-zinc-800">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            <Icon name="Eye" className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                          {order.status === "delivered" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
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
                      <Label className="text-sm font-medium">
                        Email уведомления
                      </Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать уведомления о заказах на email
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.emailNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        SMS уведомления
                      </Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать SMS о статусе заказов
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.smsNotifications}
                      onCheckedChange={(checked) =>
                        handlePreferenceChange("smsNotifications", checked)
                      }
                    />
                  </div>

                  <Separator className="bg-zinc-800" />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Новостная рассылка
                      </Label>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        Получать информацию о новых товарах и акциях
                      </p>
                    </div>
                    <Switch
                      checked={user.preferences.newsletter}
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
