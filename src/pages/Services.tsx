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

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: "fixed" | "hourly" | "negotiable";
  images: string[];
  category: string;
  subcategory?: string;
  provider: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    responseTime: string;
  };
  location: string;
  createdAt: string;
  available: boolean;
  featured: boolean;
  tags: string[];
  workingHours?: string;
  experience?: string;
}

const Services = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({
    priceRange: "",
    priceType: "",
    sortBy: "newest",
    location: "",
    rating: "",
  });

  const [services] = useState<Service[]>([
    {
      id: "1",
      title: "Полное ТО мотоцикла",
      description:
        "Комплексное техническое обслуживание: замена масла, фильтров, свечей, диагностика всех систем.",
      price: 5000,
      priceType: "fixed",
      images: ["https://picsum.photos/400/300?random=20"],
      category: "Техобслуживание",
      subcategory: "Диагностика",
      provider: {
        id: "1",
        name: 'Мотосервис "Профи"',
        avatar: "https://picsum.photos/50/50?random=10",
        rating: 4.9,
        reviewCount: 127,
        isVerified: true,
        responseTime: "10 мин",
      },
      location: "Тюмень",
      createdAt: "2024-01-15",
      available: true,
      featured: true,
      tags: ["ТО", "диагностика", "профессионально"],
      workingHours: "Пн-Пт: 9:00-18:00",
      experience: "15 лет",
    },
    {
      id: "2",
      title: "Покраска мотоцикла",
      description:
        "Качественная покраска мотоциклов и скутеров. Любые цвета и дизайн.",
      price: 2000,
      priceType: "hourly",
      images: ["https://picsum.photos/400/300?random=21"],
      category: "Кузовные работы",
      subcategory: "Покраска",
      provider: {
        id: "2",
        name: "Александр Малярович",
        avatar: "https://picsum.photos/50/50?random=11",
        rating: 4.7,
        reviewCount: 89,
        isVerified: true,
        responseTime: "30 мин",
      },
      location: "Тюмень",
      createdAt: "2024-01-14",
      available: true,
      featured: false,
      tags: ["покраска", "дизайн", "кузов"],
      workingHours: "Пн-Сб: 10:00-19:00",
      experience: "8 лет",
    },
    {
      id: "3",
      title: "Чип-тюнинг двигателя",
      description:
        "Профессиональная настройка ЭБУ для увеличения мощности и экономии топлива.",
      price: 15000,
      priceType: "fixed",
      images: ["https://picsum.photos/400/300?random=22"],
      category: "Тюнинг",
      subcategory: "Двигатель",
      provider: {
        id: "3",
        name: 'Тюнинг-центр "Форсаж"',
        avatar: "https://picsum.photos/50/50?random=12",
        rating: 4.8,
        reviewCount: 156,
        isVerified: true,
        responseTime: "5 мин",
      },
      location: "Тюмень",
      createdAt: "2024-01-13",
      available: true,
      featured: true,
      tags: ["тюнинг", "мощность", "ЭБУ"],
      workingHours: "Пн-Вс: 9:00-21:00",
      experience: "12 лет",
    },
    {
      id: "4",
      title: "Ремонт подвески",
      description:
        "Диагностика и ремонт передней и задней подвески мотоциклов всех типов.",
      price: 0,
      priceType: "negotiable",
      images: ["https://picsum.photos/400/300?random=23"],
      category: "Ремонт",
      subcategory: "Подвеска",
      provider: {
        id: "4",
        name: "Иван Механик",
        avatar: "https://picsum.photos/50/50?random=13",
        rating: 4.6,
        reviewCount: 45,
        isVerified: false,
        responseTime: "1 час",
      },
      location: "Тюмень",
      createdAt: "2024-01-12",
      available: true,
      featured: false,
      tags: ["подвеска", "ремонт", "диагностика"],
      workingHours: "Пн-Пт: 9:00-17:00",
      experience: "6 лет",
    },
    {
      id: "5",
      title: "Установка сигнализации",
      description:
        "Установка и настройка противоугонных систем. Гарантия 2 года.",
      price: 8000,
      priceType: "fixed",
      images: ["https://picsum.photos/400/300?random=24"],
      category: "Электрика",
      subcategory: "Сигнализация",
      provider: {
        id: "5",
        name: "Автоэлектрик Сергей",
        avatar: "https://picsum.photos/50/50?random=14",
        rating: 4.5,
        reviewCount: 67,
        isVerified: true,
        responseTime: "20 мин",
      },
      location: "Тюмень",
      createdAt: "2024-01-11",
      available: true,
      featured: false,
      tags: ["сигнализация", "безопасность", "электрика"],
      workingHours: "Пн-Сб: 10:00-20:00",
      experience: "10 лет",
    },
  ]);

  const categories = [...new Set(services.map((s) => s.category))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      priceType: "",
      sortBy: "newest",
      location: "",
      rating: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || service.category === selectedCategory;
    const matchesPriceType =
      !filters.priceType || service.priceType === filters.priceType;
    const matchesRating =
      !filters.rating || service.provider.rating >= parseFloat(filters.rating);

    let matchesPrice = true;
    if (filters.priceRange && service.priceType !== "negotiable") {
      const [min, max] = filters.priceRange
        .split("-")
        .map((p) => parseInt(p) || 0);
      if (filters.priceRange === "20000+") {
        matchesPrice = service.price >= 20000;
      } else {
        matchesPrice =
          service.price >= min && service.price <= (max || Infinity);
      }
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPriceType &&
      matchesRating &&
      matchesPrice
    );
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.provider.rating - a.provider.rating;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const getPriceText = (service: Service) => {
    switch (service.priceType) {
      case "fixed":
        return `${service.price.toLocaleString()} ₽`;
      case "hourly":
        return `${service.price.toLocaleString()} ₽/час`;
      case "negotiable":
        return "Договорная";
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
              className="text-4xl font-bold mb-2 orange-gradient bg-clip-text text-transparent"
              style={{ fontFamily: "Oswald, sans-serif" }}
            >
              Сервисы
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Найди мастера для ремонта и обслуживания твоего мотоцикла
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Добавить услугу
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
                    placeholder="Поиск услуг..."
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
                    <option value="0-3000">До 3 000 ₽</option>
                    <option value="3000-8000">3 000 - 8 000 ₽</option>
                    <option value="8000-15000">8 000 - 15 000 ₽</option>
                    <option value="15000-20000">15 000 - 20 000 ₽</option>
                    <option value="20000+">От 20 000 ₽</option>
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
                    <option value="hourly">Почасовая</option>
                    <option value="negotiable">Договорная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Рейтинг
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      handleFilterChange("rating", e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">Любой рейтинг</option>
                    <option value="4.5">4.5+ звезд</option>
                    <option value="4.0">4.0+ звезд</option>
                    <option value="3.5">3.5+ звезд</option>
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
                    <option value="rating">По рейтингу</option>
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

          {/* Услуги */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено услуг: {sortedServices.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Icon name="Grid3x3" className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="List" className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedServices.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {service.featured && (
                        <Badge className="bg-orange-500 text-white">Топ</Badge>
                      )}
                      <Badge variant="outline" className="bg-white">
                        {service.category}
                      </Badge>
                      <FavoriteButton
                        item={{
                          id: service.id,
                          type: "service",
                          title: service.title,
                          description: service.description,
                          image: service.images[0],
                        }}
                      />
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle
                      className="text-lg leading-tight line-clamp-2"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {service.title}
                    </CardTitle>
                    <p
                      className="text-sm text-muted-foreground line-clamp-3"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {service.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-500">
                        {getPriceText(service)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={service.provider.avatar}
                          alt={service.provider.name}
                        />
                        <AvatarFallback className="text-xs">
                          {service.provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {service.provider.name}
                          </span>
                          {service.provider.isVerified && (
                            <Icon
                              name="BadgeCheck"
                              className="h-4 w-4 text-blue-500"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Icon name="Clock" className="h-3 w-3" />
                          <span>
                            отвечает через {service.provider.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                        <span>{service.provider.rating}</span>
                        <span className="text-muted-foreground">
                          ({service.provider.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          name="MapPin"
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span>{service.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          name="Calendar"
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span>{service.workingHours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon
                          name="Award"
                          className="h-4 w-4 text-muted-foreground"
                        />
                        <span>Опыт: {service.experience}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <div className="flex gap-2 w-full">
                      <Button variant="outline" className="flex-1">
                        <Icon name="MessageCircle" className="h-4 w-4 mr-2" />
                        Написать
                      </Button>
                      <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
                        <Icon name="Phone" className="h-4 w-4 mr-2" />
                        Заказать
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {sortedServices.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  name="Wrench"
                  className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2">
                  Услуги не найдены
                </h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
