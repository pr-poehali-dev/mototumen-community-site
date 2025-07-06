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
import SearchFilter from "@/components/ui/search-filter";
import FavoriteButton from "@/components/ui/favorite-button";
import { useAuth } from "@/contexts/AuthContext";
import Icon from "@/components/ui/icon";

interface Product {
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

const Shop = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filters, setFilters] = useState({
    priceRange: "",
    condition: "",
    sortBy: "newest",
    location: "",
  });

  const [products] = useState<Product[]>([
    {
      id: "1",
      title: "Мотошлем AGV K1 S",
      description:
        "Полнолицевой мотошлем с отличной защитой и вентиляцией. Состояние отличное.",
      price: 15000,
      originalPrice: 18000,
      images: ["https://picsum.photos/400/300?random=10"],
      category: "Экипировка",
      subcategory: "Шлемы",
      condition: "used",
      seller: {
        id: "1",
        name: "Алексей Мотоциклист",
        avatar: "https://picsum.photos/50/50?random=1",
        rating: 4.8,
        reviewCount: 24,
        isVerified: true,
      },
      location: "Тюмень",
      createdAt: "2024-01-15",
      inStock: true,
      featured: true,
      tags: ["шлем", "защита", "AGV"],
      specifications: {
        Размер: "L",
        Материал: "Карбон",
        Вес: "1.3 кг",
        Сертификация: "ECE 22.05",
      },
    },
    {
      id: "2",
      title: "Мотоперчатки Alpinestars GP Pro",
      description:
        "Профессиональные гоночные перчатки с карбоновыми накладками.",
      price: 8500,
      images: ["https://picsum.photos/400/300?random=11"],
      category: "Экипировка",
      subcategory: "Перчатки",
      condition: "new",
      seller: {
        id: "2",
        name: 'Мотомагазин "Скорость"',
        avatar: "https://picsum.photos/50/50?random=2",
        rating: 4.9,
        reviewCount: 156,
        isVerified: true,
      },
      location: "Тюмень",
      createdAt: "2024-01-14",
      inStock: true,
      featured: false,
      tags: ["перчатки", "гонки", "alpinestars"],
      specifications: {
        Размер: "M",
        Материал: "Кожа + карбон",
        Тип: "Гоночные",
      },
    },
    {
      id: "3",
      title: "Мотокуртка Dainese Racing 3",
      description: "Кожаная мотокуртка с защитными вставками. Размер L.",
      price: 25000,
      originalPrice: 30000,
      images: ["https://picsum.photos/400/300?random=12"],
      category: "Экипировка",
      subcategory: "Куртки",
      condition: "used",
      seller: {
        id: "3",
        name: "Петр Байкер",
        avatar: "https://picsum.photos/50/50?random=3",
        rating: 4.6,
        reviewCount: 8,
        isVerified: false,
      },
      location: "Тюмень",
      createdAt: "2024-01-13",
      inStock: true,
      featured: true,
      tags: ["куртка", "защита", "dainese"],
      specifications: {
        Размер: "L",
        Материал: "Кожа",
        Защита: "CE Level 2",
      },
    },
    {
      id: "4",
      title: "Выхлопная система Akrapovic",
      description: "Полная выхлопная система для спортбайков. Титановая.",
      price: 45000,
      images: ["https://picsum.photos/400/300?random=13"],
      category: "Запчасти",
      subcategory: "Выхлопные системы",
      condition: "new",
      seller: {
        id: "4",
        name: 'Тюнинг центр "Форсаж"',
        avatar: "https://picsum.photos/50/50?random=4",
        rating: 4.7,
        reviewCount: 89,
        isVerified: true,
      },
      location: "Тюмень",
      createdAt: "2024-01-12",
      inStock: true,
      featured: true,
      tags: ["выхлоп", "тюнинг", "akrapovic"],
      specifications: {
        Материал: "Титан",
        Совместимость: "Универсальная",
        Вес: "3.2 кг",
      },
    },
    {
      id: "5",
      title: "Мотоботы Sidi Crossfire 3",
      description:
        "Профессиональные мотокроссовые ботинки в отличном состоянии.",
      price: 12000,
      originalPrice: 16000,
      images: ["https://picsum.photos/400/300?random=14"],
      category: "Экипировка",
      subcategory: "Обувь",
      condition: "used",
      seller: {
        id: "5",
        name: "Кроссмен72",
        avatar: "https://picsum.photos/50/50?random=5",
        rating: 4.5,
        reviewCount: 12,
        isVerified: false,
      },
      location: "Тюмень",
      createdAt: "2024-01-11",
      inStock: true,
      featured: false,
      tags: ["ботинки", "кросс", "sidi"],
      specifications: {
        Размер: "42",
        Тип: "Мотокросс",
        Защита: "Усиленная",
      },
    },
  ]);

  const categories = [...new Set(products.map((p) => p.category))];
  const locations = [...new Set(products.map((p) => p.location))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      condition: "",
      sortBy: "newest",
      location: "",
    });
    setSearchTerm("");
    setSelectedCategory("");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesCondition =
      !filters.condition || product.condition === filters.condition;
    const matchesLocation =
      !filters.location || product.location === filters.location;

    let matchesPrice = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
        .split("-")
        .map((p) => parseInt(p) || 0);
      if (filters.priceRange === "50000+") {
        matchesPrice = product.price >= 50000;
      } else {
        matchesPrice =
          product.price >= min && product.price <= (max || Infinity);
      }
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesCondition &&
      matchesLocation &&
      matchesPrice
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.seller.rating - a.seller.rating;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-500";
      case "used":
        return "bg-blue-500";
      case "refurbished":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "new":
        return "Новое";
      case "used":
        return "Б/у";
      case "refurbished":
        return "Восстановленное";
      default:
        return "";
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
              Магазин
            </h1>
            <p
              className="text-muted-foreground"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Покупай и продавай мотоэкипировку, запчасти и аксессуары
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Icon name="Plus" className="h-4 w-4 mr-2" />
              Продать
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
                    placeholder="Поиск товаров..."
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
                    <option value="0-5000">До 5 000 ₽</option>
                    <option value="5000-15000">5 000 - 15 000 ₽</option>
                    <option value="15000-30000">15 000 - 30 000 ₽</option>
                    <option value="30000-50000">30 000 - 50 000 ₽</option>
                    <option value="50000+">От 50 000 ₽</option>
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
                    <option value="refurbished">Восстановленное</option>
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

          {/* Товары */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Найдено товаров: {sortedProducts.length}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {product.featured && (
                        <Badge className="bg-orange-500 text-white">Топ</Badge>
                      )}
                      <Badge
                        className={`${getConditionColor(product.condition)} text-white`}
                      >
                        {getConditionText(product.condition)}
                      </Badge>
                      <FavoriteButton
                        item={{
                          id: product.id,
                          type: "product",
                          title: product.title,
                          description: product.description,
                          image: product.images[0],
                        }}
                      />
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle
                      className="text-lg leading-tight line-clamp-2"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      {product.title}
                    </CardTitle>
                    <p
                      className="text-sm text-muted-foreground line-clamp-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {product.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-orange-500">
                        {product.price.toLocaleString()} ₽
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()} ₽
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={product.seller.avatar}
                          alt={product.seller.name}
                        />
                        <AvatarFallback className="text-xs">
                          {product.seller.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {product.seller.name}
                      </span>
                      {product.seller.isVerified && (
                        <Icon
                          name="BadgeCheck"
                          className="h-4 w-4 text-blue-500"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" className="h-4 w-4 text-yellow-500" />
                        <span>{product.seller.rating}</span>
                        <span>({product.seller.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" className="h-4 w-4" />
                        <span>{product.location}</span>
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
                        <Icon name="ShoppingCart" className="h-4 w-4 mr-2" />
                        Купить
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <Icon
                  name="Package"
                  className="h-16 w-16 mx-auto mb-4 text-muted-foreground"
                />
                <h3 className="text-lg font-semibold mb-2">
                  Товары не найдены
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

export default Shop;
