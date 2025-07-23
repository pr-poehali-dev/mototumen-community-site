import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";
import ClassifiedFilters from "@/components/classifieds/ClassifiedFilters";
import ClassifiedTabs from "@/components/classifieds/ClassifiedTabs";
import {
  type Classified,
  getTypeConfig,
  getConditionColor,
  getConditionText,
  getPriceText,
  getFilteredClassifieds,
  sortedClassifieds,
} from "@/components/classifieds/ClassifiedUtils";

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

  const getFilteredClassifiedsWrapper = (type?: string) => {
    return getFilteredClassifieds(
      classifieds,
      type,
      searchTerm,
      selectedCategory,
      filters
    );
  };

  const sortedClassifiedsWrapper = (items: Classified[]) => {
    return sortedClassifieds(items, filters.sortBy);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold mb-2 blue-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Объявления
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Покупай, продавай, меняй и находи всё для мотоцикла
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button className="bg-accent hover:bg-accent/90">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Подать объявление
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Фильтры */}
          <div className="lg:col-span-1">
            <ClassifiedFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
            />
          </div>

          {/* Объявления */}
          <div className="lg:col-span-3">
            <ClassifiedTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              getFilteredClassifieds={getFilteredClassifiedsWrapper}
              sortedClassifieds={sortedClassifiedsWrapper}
              getTypeConfig={getTypeConfig}
              getConditionColor={getConditionColor}
              getConditionText={getConditionText}
              getPriceText={getPriceText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classifieds;