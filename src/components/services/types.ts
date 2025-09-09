export interface WorkSchedule {
  day: string;
  hours: string;
}

export interface ServiceData {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  hours: string;
  location: string;
  phone: string;
  services?: string[];
  features?: string[];
  website?: string;
  addresses?: { name: string; yandexUrl: string }[];
  schedule?: WorkSchedule[];
}