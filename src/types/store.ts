export interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  bannerImage?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  location: string;
  category: string;
  totalProducts: number;
  followers: number;
  createdAt: string;
  isOpen: boolean;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contacts: {
    phone?: string;
    telegram?: string;
    whatsapp?: string;
    website?: string;
  };
  tags: string[];
  featured: boolean;
}

export interface StoreFilters {
  category: string;
  location: string;
  rating: string;
  sortBy: string;
}

export type StoreSortOption = "newest" | "rating" | "popular" | "name";
