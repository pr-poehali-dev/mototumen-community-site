interface Classified {
  id: string;
  title: string;
  description: string;
  price?: number;
  priceType: "fixed" | "negotiable" | "free" | "exchange";
  images: string[];
  category: string;
  subcategory?: string;
  type: "sale" | "wanted" | "exchange" | "free";
  condition?: "new" | "used" | "broken";
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    responseTime: string;
    memberSince: string;
  };
  location: string;
  createdAt: string;
  featured: boolean;
  urgent: boolean;
  tags: string[];
  contactPreference: "phone" | "message" | "both";
  viewCount: number;
  favoriteCount: number;
}

export const getTypeConfig = (type: string) => {
  switch (type) {
    case "sale":
      return { label: "Продажа", color: "bg-blue-500", icon: "ShoppingCart" };
    case "wanted":
      return { label: "Куплю", color: "bg-green-500", icon: "Search" };
    case "exchange":
      return {
        label: "Обмен",
        color: "bg-purple-500",
        icon: "ArrowLeftRight",
      };
    case "free":
      return { label: "Даром", color: "bg-orange-500", icon: "Gift" };
    default:
      return { label: "Объявление", color: "bg-gray-500", icon: "FileText" };
  }
};

export const getConditionColor = (condition?: string) => {
  switch (condition) {
    case "new":
      return "bg-green-500";
    case "used":
      return "bg-blue-500";
    case "broken":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const getConditionText = (condition?: string) => {
  switch (condition) {
    case "new":
      return "Новое";
    case "used":
      return "Б/у";
    case "broken":
      return "Требует ремонта";
    default:
      return "";
  }
};

export const getPriceText = (classified: Classified) => {
  switch (classified.priceType) {
    case "fixed":
      return `${classified.price?.toLocaleString()} ₽`;
    case "negotiable":
      return classified.price
        ? `${classified.price.toLocaleString()} ₽ (торг)`
        : "Договорная";
    case "free":
      return "Бесплатно";
    case "exchange":
      return "Обмен";
    default:
      return "Не указано";
  }
};

export const getFilteredClassifieds = (
  classifieds: Classified[],
  type: string | undefined,
  searchTerm: string,
  selectedCategory: string,
  filters: {
    priceRange: string;
    condition: string;
    priceType: string;
    sortBy: string;
    location: string;
  }
) => {
  let items = classifieds;

  if (type && type !== "all") {
    items = items.filter((item) => item.type === type);
  }

  return items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    const matchesCondition =
      !filters.condition || item.condition === filters.condition;
    const matchesPriceType =
      !filters.priceType || item.priceType === filters.priceType;

    let matchesPrice = true;
    if (filters.priceRange && item.price) {
      const [min, max] = filters.priceRange
        .split("-")
        .map((p) => parseInt(p) || 0);
      if (filters.priceRange === "500000+") {
        matchesPrice = item.price >= 500000;
      } else {
        matchesPrice = item.price >= min && item.price <= (max || Infinity);
      }
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCondition &&
      matchesPriceType &&
      matchesPrice
    );
  });
};

export const sortedClassifieds = (
  items: Classified[],
  sortBy: string
) =>
  [...items].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return (a.price || 0) - (b.price || 0);
      case "price-desc":
        return (b.price || 0) - (a.price || 0);
      case "popular":
        return b.viewCount - a.viewCount;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

export type { Classified };