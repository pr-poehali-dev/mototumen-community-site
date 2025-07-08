import { useState, useMemo } from "react";
import { UserProfile } from "@/contexts/AuthContext";
import { UserStats, UserActivity, UserOrder } from "@/types/user";

export const useUserData = (user: UserProfile) => {
  const [userStats] = useState<UserStats>({
    level: 15,
    experience: 2350,
    maxExperience: 3000,
    ridesCount: 47,
    totalDistance: 12580,
    eventsAttended: 23,
    purchasesCount: 8,
  });

  const [recentActivities] = useState<UserActivity[]>([
    {
      type: "ride",
      title: "Поездка в Абалак",
      date: "2 дня назад",
      icon: "Bike",
    },
    {
      type: "purchase",
      title: "Купил мотоперчатки",
      date: "5 дней назад",
      icon: "ShoppingBag",
    },
    {
      type: "event",
      title: "Участвовал в встрече клуба",
      date: "1 неделю назад",
      icon: "Users",
    },
    {
      type: "service",
      title: "Записался на ТО",
      date: "2 недели назад",
      icon: "Wrench",
    },
  ]);

  const [userOrders] = useState<UserOrder[]>([
    {
      id: "#MT-2024-001",
      item: "Шлем Shoei GT-Air II",
      status: "Доставлен",
      price: "₽35,000",
      date: "15.01.2024",
    },
    {
      id: "#MT-2024-002",
      item: "Мотоперчатки Alpinestars",
      status: "В пути",
      price: "₽8,500",
      date: "20.01.2024",
    },
    {
      id: "#MT-2024-003",
      item: "Техобслуживание",
      status: "Выполнено",
      price: "₽2,500",
      date: "10.01.2024",
    },
  ]);

  const userInitials = useMemo(() => {
    return `${user.firstName[0]}${user.lastName?.[0] || ""}`;
  }, [user.firstName, user.lastName]);

  const fullName = useMemo(() => {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }, [user.firstName, user.lastName]);

  return {
    userStats,
    recentActivities,
    userOrders,
    userInitials,
    fullName,
  };
};
