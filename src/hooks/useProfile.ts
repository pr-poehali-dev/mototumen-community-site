import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserProfile, Order, Vehicle } from "@/types/profile";

export const useProfile = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    photoUrl: "",
    bio: "",
    role: "user",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
    },
    address: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mainVehicleId, setMainVehicleId] = useState<string>("");

  // Инициализация данных профиля из аутентификации
  useEffect(() => {
    if (authUser) {
      setUser({
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

      // Загрузка мок-данных заказов
      setOrders([
        {
          id: "ORD-2024-001",
          date: "2024-03-15",
          status: "delivered",
          total: 45990,
          items: [
            {
              id: "1",
              name: "Шлем AGV K1",
              quantity: 1,
              price: 25990,
              image: "/api/placeholder/60/60",
            },
            {
              id: "2",
              name: "Перчатки Alpinestars",
              quantity: 1,
              price: 8500,
              image: "/api/placeholder/60/60",
            },
            {
              id: "3",
              name: "Куртка Dainese",
              quantity: 1,
              price: 11500,
              image: "/api/placeholder/60/60",
            },
          ],
        },
        {
          id: "ORD-2024-002",
          date: "2024-02-28",
          status: "shipped",
          total: 32450,
          items: [
            {
              id: "4",
              name: "Масло Motul 5000",
              quantity: 2,
              price: 1450,
              image: "/api/placeholder/60/60",
            },
            {
              id: "5",
              name: "Фильтр воздушный K&N",
              quantity: 1,
              price: 2890,
              image: "/api/placeholder/60/60",
            },
          ],
        },
      ]);

      // Загрузка мок-данных транспорта
      setVehicles([
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
          description: "Отличное состояние, регулярное ТО",
          createdAt: "2024-01-15",
        },
      ]);

      setMainVehicleId("1");
    }
  }, [authUser]);

  const handleUserUpdate = (updatedUser: Partial<UserProfile>) => {
    setUser((prev) => ({
      ...prev,
      ...updatedUser,
    }));
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

  const handleVehicleUpdate = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
  };

  const handleMainVehicleChange = (vehicleId: string) => {
    setMainVehicleId(vehicleId);
  };

  return {
    user,
    orders,
    vehicles,
    mainVehicleId,
    handleUserUpdate,
    handlePreferenceChange,
    handleVehicleUpdate,
    handleMainVehicleChange,
  };
};
