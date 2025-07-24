export interface SchoolData {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  rating: number;
  price: string;
  experience: string;
  location: string;
  phone: string;
  instructor: string;
  courses: string[];
  features: string[];
  website?: string;
  addresses?: { name: string; yandexUrl: string }[];
}