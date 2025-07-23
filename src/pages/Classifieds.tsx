import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FavoriteButton from "@/components/ui/favorite-button";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

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
        default:
          return 0;
      }
    });

  const getTypeConfig = (type: string) => {
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

  const getConditionColor = (condition?: string) => {
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

  const getConditionText = (condition?: string) => {
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

  const getPriceText = (classified: Classified) => {
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Фильтры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Icon
                    name="Search"
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Поиск объявлений..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Категория
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Цена</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) =>
                      handleFilterChange("priceRange", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любая цена</option>
                    <option value="0-10000">До 10 000 ₽</option>
                    <option value="10000-50000">10 000 - 50 000 ₽</option>
                    <option value="50000-200000">50 000 - 200 000 ₽</option>
                    <option value="200000-500000">200 000 - 500 000 ₽</option>
                    <option value="500000+">От 500 000 ₽</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Состояние
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) =>
                      handleFilterChange("condition", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любое</option>
                    <option value="new">Новое</option>
                    <option value="used">Б/у</option>
                    <option value="broken">Требует ремонта</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тип цены
                  </label>
                  <select
                    value={filters.priceType}
                    onChange={(e) =>
                      handleFilterChange("priceType", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любой тип</option>
                    <option value="fixed">Фиксированная</option>
                    <option value="negotiable">Торг</option>
                    <option value="free">Бесплатно</option>
                    <option value="exchange">Обмен</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Сортировка
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="newest">Сначала новые</option>
                    <option value="price-asc">Сначала дешевые</option>
                    <option value="price-desc">Сначала дорогие</option>
                    <option value="popular">По популярности</option>
                  </select>
                </div>

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="RotateCcw" className="h-4 w-4 mr-2" />
                  Сбросить фильтры
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Объявления */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="sale">Продажа</TabsTrigger>
                <TabsTrigger value="wanted">Куплю</TabsTrigger>
                <TabsTrigger value="exchange">Обмен</TabsTrigger>
                <TabsTrigger value="free">Даром</TabsTrigger>
              </TabsList>

              {["all", "sale", "wanted", "exchange", "free"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue} className="mt-6">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Объявлений:{" "}
                      {
                        getFilteredClassifieds(
                          tabValue === "all" ? undefined : tabValue,
                        ).length
                      }
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedClassifieds(
                      getFilteredClassifieds(
                        tabValue === "all" ? undefined : tabValue,
                      ),
                    ).map((classified) => {
                      const typeConfig = getTypeConfig(classified.type);
                      return (
                        <Card
                          key={classified.id}
                          className="overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative">
                            {classified.images.length > 0 ? (
                              <img
                                src={classified.images[0]}
                                alt={classified.title}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 bg-muted flex items-center justify-center">
                                <Icon
                                  name="ImageOff"
                                  className="h-16 w-16 text-muted-foreground"
                                />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                              {classified.featured && (
                                <Badge className="bg-accent text-white">
                                  Топ
                                </Badge>
                              )}
                              {classified.urgent && (
                                <Badge className="bg-red-500 text-white">
                                  Срочно
                                </Badge>
                              )}
                              <Badge
                                className={`${typeConfig.color} text-white`}
                              >
                                {typeConfig.label}
                              </Badge>
                              <FavoriteButton
                                item={{
                                  id: classified.id,
                                  type: "classified",
                                  title: classified.title,
                                  description: classified.description,
                                  image: classified.images[0],
                                }}
                              />
                            </div>
                          </div>

                          <CardHeader className="pb-2">
                            <CardTitle
                              className="text-lg leading-tight line-clamp-2"
                              style={{ fontFamily: "Oswald, sans-serif" }}
                            >
                              {classified.title}
                            </CardTitle>
                            <p
                              className="text-sm text-muted-foreground line-clamp-3"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              {classified.description}
                            </p>
                          </CardHeader>

                          <CardContent className="pb-2">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl font-bold text-accent">
                                {getPriceText(classified)}
                              </span>
                              {classified.condition && (
                                <Badge
                                  className={`${getConditionColor(classified.condition)} text-white text-xs`}
                                >
                                  {getConditionText(classified.condition)}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={classified.seller.avatar}
                                  alt={classified.seller.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {classified.seller.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">
                                {classified.seller.name}
                              </span>
                              {classified.seller.isVerified && (
                                <Icon
                                  name="BadgeCheck"
                                  className="h-4 w-4 text-blue-500"
                                />
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Icon name="Eye" className="h-3 w-3" />
                                <span>{classified.viewCount} просмотров</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Heart" className="h-3 w-3" />
                                <span>
                                  {classified.favoriteCount} в избранном
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="Clock" className="h-3 w-3" />
                                <span>
                                  отвечает через{" "}
                                  {classified.seller.responseTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Icon name="MapPin" className="h-3 w-3" />
                                <span>{classified.location}</span>
                              </div>
                            </div>
                          </CardContent>

                          <CardFooter className="pt-2">
                            <div className="flex gap-2 w-full">
                              <Button variant="outline" className="flex-1">
                                <Icon
                                  name="MessageCircle"
                                  className="h-4 w-4 mr-2"
                                />
                                Написать
                              </Button>
                              <Button className="flex-1 bg-accent hover:bg-accent/90">
                                <Icon name="Phone" className="h-4 w-4 mr-2" />
                                Связаться
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>

                  {getFilteredClassifieds(
                    tabValue === "all" ? undefined : tabValue,
                  ).length === 0 && (
                    <div className="text-center py-12">
                      <Icon
                        name="FileText"
                        className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                      />
                      <h3 className="text-lg font-semibold mb-2">
                        Объявления не найдены
                      </h3>
                      <p className="text-muted-foreground">
                        Попробуйте изменить параметры поиска или фильтры
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classifieds;
