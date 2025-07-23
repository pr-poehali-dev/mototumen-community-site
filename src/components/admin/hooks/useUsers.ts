import { useState, useMemo } from "react";
import { TelegramUser, UserStats } from "@/types/user";

interface AdminUser extends TelegramUser {
  stats: UserStats;
  lastActivity: string;
  isActive: boolean;
  registrationDate: string;
}

export const useUsers = () => {
  const [users] = useState<AdminUser[]>([
    {
      id: 123456789,
      first_name: "Алексей",
      last_name: "Иванов",
      username: "alex_rider",
      photo_url: "",
      auth_date: 1704067200,
      stats: {
        level: 15,
        experience: 2350,
        maxExperience: 3000,
        ridesCount: 47,
        totalDistance: 12580,
        eventsAttended: 23,
        purchasesCount: 8,
      },
      lastActivity: "2 часа назад",
      isActive: true,
      registrationDate: "15.01.2024",
    },
    {
      id: 987654321,
      first_name: "Мария",
      last_name: "Петрова",
      username: "maria_moto",
      photo_url: "",
      auth_date: 1703462400,
      stats: {
        level: 8,
        experience: 1200,
        maxExperience: 1500,
        ridesCount: 23,
        totalDistance: 5430,
        eventsAttended: 12,
        purchasesCount: 3,
      },
      lastActivity: "1 день назад",
      isActive: false,
      registrationDate: "25.12.2023",
    },
    {
      id: 456789123,
      first_name: "Дмитрий",
      last_name: "Сидоров",
      username: "dmitry_speed",
      photo_url: "",
      auth_date: 1705276800,
      stats: {
        level: 22,
        experience: 4800,
        maxExperience: 5000,
        ridesCount: 89,
        totalDistance: 25670,
        eventsAttended: 45,
        purchasesCount: 15,
      },
      lastActivity: "30 минут назад",
      isActive: true,
      registrationDate: "15.01.2024",
    },
    {
      id: 789123456,
      first_name: "Анна",
      last_name: "Козлова",
      username: "anna_biker",
      photo_url: "",
      auth_date: 1704240000,
      stats: {
        level: 12,
        experience: 1850,
        maxExperience: 2000,
        ridesCount: 34,
        totalDistance: 8920,
        eventsAttended: 18,
        purchasesCount: 6,
      },
      lastActivity: "5 часов назад",
      isActive: false,
      registrationDate: "03.01.2024",
    },
    {
      id: 321654987,
      first_name: "Сергей",
      last_name: "Морозов",
      username: "sergey_moto",
      photo_url: "",
      auth_date: 1703808000,
      stats: {
        level: 18,
        experience: 3200,
        maxExperience: 4000,
        ridesCount: 67,
        totalDistance: 18450,
        eventsAttended: 31,
        purchasesCount: 11,
      },
      lastActivity: "3 дня назад",
      isActive: false,
      registrationDate: "29.12.2023",
    },
    {
      id: 654987321,
      first_name: "Елена",
      last_name: "Волкова",
      username: "elena_rider",
      photo_url: "",
      auth_date: 1705363200,
      stats: {
        level: 6,
        experience: 680,
        maxExperience: 1000,
        ridesCount: 15,
        totalDistance: 3200,
        eventsAttended: 8,
        purchasesCount: 2,
      },
      lastActivity: "12 часов назад",
      isActive: true,
      registrationDate: "16.01.2024",
    },
  ]);

  const activeUsers = useMemo(() => {
    return users.filter((user) => user.isActive);
  }, [users]);

  const totalUsers = users.length;
  const totalActiveUsers = activeUsers.length;

  const getUserStats = useMemo(() => {
    const totalRides = users.reduce(
      (sum, user) => sum + user.stats.ridesCount,
      0,
    );
    const totalDistance = users.reduce(
      (sum, user) => sum + user.stats.totalDistance,
      0,
    );
    const totalPurchases = users.reduce(
      (sum, user) => sum + user.stats.purchasesCount,
      0,
    );
    const avgLevel =
      users.reduce((sum, user) => sum + user.stats.level, 0) / users.length;

    return {
      totalRides,
      totalDistance,
      totalPurchases,
      avgLevel: Math.round(avgLevel),
    };
  }, [users]);

  return {
    users,
    activeUsers,
    totalUsers,
    totalActiveUsers,
    getUserStats,
  };
};
