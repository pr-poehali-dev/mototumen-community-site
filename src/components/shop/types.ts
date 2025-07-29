import { WorkSchedule } from "@/components/schools/types";

export interface ShopData {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  shortAddress: string;
  phone: string;
  website: string;
  telegram?: string;
  vk?: string;
  whatsapp?: string;
  workTime: string;
  shortWorkTime: string;
  openTime: number;
  closeTime: number;
  rating: number;
  icon: string;
  color: string;
  schedule?: WorkSchedule[];
}

export interface ShopStatusResult {
  status: string;
  color: string;
  dotColor: string;
}