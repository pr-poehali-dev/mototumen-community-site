import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import ClassifiedFilters from "@/components/classifieds/ClassifiedFilters";
import ClassifiedStats from "@/components/classifieds/ClassifiedStats";
import ClassifiedCard from "@/components/classifieds/ClassifiedCard";

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

const Classifieds = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    priceRange: "",
    condition: "",
    priceType: "",
    sortBy: "newest",
    location: "",
  });

  const [classifieds] = useState<Classified[]>([
    {
      id: "1",
      title: "Продаю Honda CBR600RR 2019",
      description:
        "Спортбайк в отличном состоянии, пробег 15 000 км. Полное ТО, новая резина. Документы в порядке.",
      price: 850000,
      priceType: "negotiable",
      images: ["https://picsum.photos/400/300?random=40"],
      category: "Мотоциклы",
      subcategory: "Спортбайки",
      type: "sale",
      condition: "used",
      seller: {
        id: "1",
        name: "Максим Петров",
        avatar: "https://picsum.photos/50/50?random=20",
        rating: 4.8,
        reviewCount: 23,
        isVerified: true,
        responseTime: "10 мин",
        memberSince: "2020",
      },
      location: "Тюмень",
      createdAt: "2024-01-15",
      featured: true,
      urgent: false,
      tags: ["honda", "спорт", "cbr"],
      contactPreference: "both",
      viewCount: 156,
      favoriteCount: 12,
    },
    {
      id: "2",
      title: "Ищу мотошлем размер L",
      description:
        "Нужен качественный шлем размера L, желательно AGV, Shoei или Arai. Состояние хорошее.",
      priceType: "negotiable",
      images: [],
      category: "Экипировка",
      subcategory: "Шлемы",
      type: "wanted",
      seller: {
        id: "2",
        name: "Андрей Сидоров",
        avatar: "https://picsum.photos/50/50?random=21",
        rating: 4.6,
        reviewCount: 8,
        isVerified: false,
        responseTime: "30 мин",
        memberSince: "2022",
      },
      location: "Тюмень",
      createdAt: "2024-01-14",
      featured: false,
      urgent: true,
      tags: ["шлем", "экипировка", "AGV"],
      contactPreference: "message",
      viewCount: 89,
      favoriteCount: 5,
    },
    {
      id: "3",
      title: "Меняю мотоперчатки на мотоботы",
      description:
        "Есть новые перчатки Alpinestars размера M, хочу обменять на ботинки размера 42.",
      priceType: "exchange",
      images: ["https://picsum.photos/400/300?random=41"],
      category: "Экипировка",
      subcategory: "Перчатки",
      type: "exchange",
      condition: "new",
      seller: {
        id: "3",
        name: "Елена Кузнецова",
        avatar: "https://picsum.photos/50/50?random=22",
        rating: 4.9,
        reviewCount: 45,
        isVerified: true,
        responseTime: "5 мин",
        memberSince: "2019",
      },
      location: "Тюмень",
      createdAt: "2024-01-13",
      featured: false,
      urgent: false,
      tags: ["обмен", "перчатки", "ботинки"],
      contactPreference: "phone",
      viewCount: 67,
      favoriteCount: 8,
    },
    {
      id: "4",
      title: "Отдам бесплатно старые запчасти",
      description:
        "Остались запчасти от старого мотоцикла. Может кому пригодятся для восстановления.",
      priceType: "free",
      images: ["https://picsum.photos/400/300?random=42"],
      category: "Запчасти",
      subcategory: "Разное",
      type: "free",
      condition: "used",
      seller: {
        id: "4",
        name: "Игорь Механик",
        avatar: "https://picsum.photos/50/50?random=23",
        rating: 4.7,
        reviewCount: 67,
        isVerified: true,
        responseTime: "1 час",
        memberSince: "2018",
      },
      location: "Тюмень",
      createdAt: "2024-01-12",
      featured: false,
      urgent: false,
      tags: ["бесплатно", "запчасти", "старые"],
      contactPreference: "message",
      viewCount: 234,
      favoriteCount: 23,
    },
    {
      id: "5",
      title: "Продаю мотокуртку Dainese",
      description:
        "Кожаная куртка размера L, практически новая. Носил пару раз.",
      price: 35000,
      priceType: "fixed",
      images: ["https://picsum.photos/400/300?random=43"],
      category: "Экипировка",
      subcategory: "Куртки",
      type: "sale",
      condition: "used",
      seller: {
        id: "5",
        name: "Сергей Байкер",
        avatar: "https://picsum.photos/50/50?random=24",
        rating: 4.5,
        reviewCount: 12,
        isVerified: false,
        responseTime: "2 часа",
        memberSince: "2021",
      },
      location: "Тюмень",
      createdAt: "2024-01-11",
      featured: false,
      urgent: true,
      tags: ["куртка", "dainese", "кожа"],
      contactPreference: "both",
      viewCount: 123,
      favoriteCount: 7,
    },
  ]);

  const categories = [...new Set(classifieds.map((c) => c.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      condition: "",
      priceType: "",
      sortBy: "newest",
      location: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
  };

  const getFilteredClassifieds = (type?: string) => {
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

  const sortedClassifieds = (items: Classified[]) =>
    [...items].sort((a, b) => {
      switch (filters.sortBy) {
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
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

  const renderClassifiedsList = (type?: string) => {
    const items = sortedClassifieds(getFilteredClassifieds(type));

    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-zinc-400">Объявления не найдены</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ClassifiedCard key={item.id} item={item} user={user} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <ClassifiedFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          categories={categories}
          filters={filters}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <ClassifiedStats classifieds={classifieds} />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-zinc-800 border-zinc-700 w-full justify-start">
            <TabsTrigger value="all">Все объявления</TabsTrigger>
            <TabsTrigger value="sale">Продажа</TabsTrigger>
            <TabsTrigger value="wanted">Куплю</TabsTrigger>
            <TabsTrigger value="exchange">Обмен</TabsTrigger>
            <TabsTrigger value="free">Бесплатно</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderClassifiedsList()}
          </TabsContent>

          <TabsContent value="sale" className="mt-6">
            {renderClassifiedsList("sale")}
          </TabsContent>

          <TabsContent value="wanted" className="mt-6">
            {renderClassifiedsList("wanted")}
          </TabsContent>

          <TabsContent value="exchange" className="mt-6">
            {renderClassifiedsList("exchange")}
          </TabsContent>

          <TabsContent value="free" className="mt-6">
            {renderClassifiedsList("free")}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Classifieds;
