export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
}

export interface UserStats {
  level: number;
  experience: number;
  maxExperience: number;
  ridesCount: number;
  totalDistance: number;
  eventsAttended: number;
  purchasesCount: number;
}

export interface UserActivity {
  type: "ride" | "purchase" | "event" | "service";
  title: string;
  date: string;
  icon: string;
}

export interface UserOrder {
  id: string;
  item: string;
  status: string;
  price: string;
  date: string;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}
