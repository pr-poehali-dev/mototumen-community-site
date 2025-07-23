export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  condition: "new" | "used" | "refurbished";
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
  };
  location: string;
  createdAt: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  specifications?: Record<string, string>;
}

export interface ShopFilters {
  priceRange: string;
  condition: string;
  sortBy: string;
  location: string;
}

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";
export type ProductCondition = "new" | "used" | "refurbished";
